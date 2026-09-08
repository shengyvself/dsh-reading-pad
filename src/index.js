/**
 * dsh-reading-pad 服务端：
 * - ReadingPadService extends TypertRemoteService（remote 名 `readingPad`）：负责 AI 投递文稿的接收/持久化/读取。
 * - 模型写入口 `reading_pad_send`：接收 AI 已排版好的 Markdown（零文字处理），写入
 *   ~/.dsh/dsh-reading-pad-state.json（单当前篇 + 历史 ≤20，FIFO 淘汰）。
 * - 红线：只写 ~/.dsh/ 下的阅读板状态（会话展示文本，仿写字板状态），不触碰 canon/创作文件；
 *   读文件失败（缺失/JSON 非法/字段缺失）静默降级为空态，不崩 web。
 */
import { defineTool } from '@deepseek-ai/dsh-tools';
import { Remote, TypertRemoteService } from '@deepseek-ai/dsh-typert-protocol';
import { join, dirname } from 'node:path';
import { homedir } from 'node:os';
import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'node:fs';

const PAD_STATE_FILE = join(homedir(), '.dsh', 'dsh-reading-pad-state.json');
const HISTORY_MAX = 20;

const SEND_TOOL_NAME = 'reading_pad_send';
const SEND_TOOL_DESCRIPTION = [
  '把一段已排版好的 Markdown 文本投递进「阅读板」（沉浸式只读阅读），供用户/后续会话在阅读板中阅读，返回短确认。',
  '',
  '触发条件：仅当用户明确要求「投递到阅读板 / 放到阅读板 / 沉浸阅读 / 去阅读板看」时调用；',
  '普通成稿直接在对话正文交付（无写作板工具），避免双写。',
  '',
  '投递前的排版要求（AI 全权负责，阅读板零文字处理、原样渲染）：',
  '- 中文排版规范：中英文/数字之间加空格；标点用全角；标题层级清晰（h1-h6）；段落分明；不用无意义断行。',
  '- 首行缩进由 CSS 统一施加（2em），绝不要在 content 里手工加全角空格或其它字符做首行缩进（否则双重缩进）。',
  '- 段落之间用空行分隔；连续正文段落每段一行，不要手工插空行到段内。',
  '',
  'M1 渲染子集（前端支持，超出不支持——不要产出这些形式）：',
  '- 支持：标题、段落、粗体/斜体/删除线、行内代码、链接/图片、单层有序/无序列表、引用、分隔线、围栏代码块、GFM 表格。',
  '- 不支持：嵌套列表、任务列表、脚注、内嵌 HTML（会原样转义显示）。链接/图片只允许 http/https/相对路径。',
  '',
  '服务端只做结构性校验（content 必须为字符串），不改任何文字。'
].join('\n');

/** 从磁盘加载阅读板状态；任何损坏（缺失/JSON 非法/字段类型不符）静默降级为空态。 */
function loadPersistedState() {
  const empty = { version: 1, revision: 0, current: null, history: [] };
  try {
    if (!existsSync(PAD_STATE_FILE)) return empty;
    const p = JSON.parse(readFileSync(PAD_STATE_FILE, 'utf8'));
    if (p === null || typeof p !== 'object' || Array.isArray(p)) return empty;
    const history = Array.isArray(p.history)
      ? p.history.filter((h) => h !== null && typeof h === 'object' && typeof h.content === 'string').slice(0, HISTORY_MAX)
      : [];
    const current = p.current !== null && p.current !== undefined && typeof p.current === 'object' && typeof p.current.content === 'string' ? p.current : null;
    return {
      version: 1,
      revision: typeof p.revision === 'number' && Number.isFinite(p.revision) ? p.revision : 0,
      current,
      history
    };
  } catch {
    return empty;
  }
}
const padState = loadPersistedState();
function persistState() {
  try {
    mkdirSync(dirname(PAD_STATE_FILE), { recursive: true });
    writeFileSync(PAD_STATE_FILE, JSON.stringify(padState));
  } catch {
    // 持久化失败不崩 web；本轮内存态仍可用
  }
}

const remoteInitializers = [];

const readingPadResultSchema = {
  type: 'object',
  properties: {
    ok: { type: 'boolean' },
    error: { type: 'string' },
    revision: { type: 'number' }
  },
  additionalProperties: true
};
function readingPadResultRender(_args, value) {
  const result = value !== null && typeof value === 'object' ? value : {};
  const lines = [];
  if (typeof result.error === 'string' && result.error.length > 0) lines.push('错误：' + result.error);
  if (result.ok === true) lines.push('已投递到阅读板（revision ' + String(result.revision ?? '') + '），用户可在「阅读板」中查看。');
  if (lines.length === 0) lines.push('(无内容)');
  return [{ type: 'text', text: lines.join('\n') }];
}

/** Host API for the reading pad client, mounted into `ctx.remote.readingPad`. */
class ReadingPadService extends TypertRemoteService {
  static inject = ['tools'];

  constructor(ctx) {
    super(ctx, 'readingPad');
    for (const initialize of remoteInitializers) initialize.call(this);
    ctx.effect(() => ctx.tools.register(this.sendToolDefinition()));
  }

  /** 接收一篇 AI 投递文稿：current 进 history（倒序、≤20、FIFO），current 换新，revision 递增。 */
  async saveReading(content, title, source) {
    if (typeof content !== 'string') {
      return { ok: false, error: 'content 必须是字符串（已排版好的 Markdown 正文）', revision: padState.revision };
    }
    const entry = {
      title: typeof title === 'string' ? title : '',
      source: typeof source === 'string' && source.length > 0 ? source : 'ai-delivery',
      updatedAt: new Date().toISOString(),
      content
    };
    if (padState.current !== null) {
      padState.history.unshift(padState.current);
      if (padState.history.length > HISTORY_MAX) padState.history.length = HISTORY_MAX;
    }
    padState.current = entry;
    padState.revision += 1;
    persistState();
    return { ok: true, error: '', revision: padState.revision };
  }

  /** 读取当前阅读板状态（单当前篇 + 历史快照；历史只存不进 UI）。 */
  async loadReading() {
    return {
      ok: true,
      error: '',
      revision: padState.revision,
      current: padState.current,
      history: padState.history
    };
  }

  sendToolDefinition() {
    return defineTool({
      name: SEND_TOOL_NAME,
      description: SEND_TOOL_DESCRIPTION,
      parameters: {
        content: {
          type: 'string',
          required: true,
          description: '已排版好的 Markdown 正文（满足下述排版规范；服务端零文字处理、原样展示）'
        },
        title: {
          type: 'string',
          description: '投递标题（可选，由 AI 给出；服务端不生成）'
        },
        source: {
          type: 'string',
          description: "来源标注（可选；缺省 ai-delivery）"
        }
      },
      output: { schema: readingPadResultSchema, render: readingPadResultRender },
      execute: async (args) => {
        const content = typeof args.content === 'string' ? args.content : null;
        return this.saveReading(content, typeof args.title === 'string' ? args.title : '', typeof args.source === 'string' ? args.source : '');
      }
    });
  }
}

function registerRemoteMarker(name) {
  Remote(name)(ReadingPadService.prototype[name], {
    name,
    static: false,
    private: false,
    addInitializer(initializer) {
      remoteInitializers.push(initializer);
    }
  });
}
for (const name of ['saveReading', 'loadReading']) registerRemoteMarker(name);

export { ReadingPadService, ReadingPadService as default };
