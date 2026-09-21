/**
 * dsh-reading-pad 浏览器端（**官方右侧栏 tab**）：
 * - tab id `narrative-reading-pad`（📖 阅读板，order 30）；注册到官方 keyed 槽位
 *   `sidebar.right.pane.tab` + `.title`（2026-09-13 解耦 dsh-better-sidebar；better-sidebar 本身
 *   也是这两个原生槽位的宿主，故两种宿主下都可见）；1s 轮询注册（防槽位未就绪），
 *   保存槽位 disposer，成功即 clearInterval、卸载时释放（防重复注册）。
 * - 内容源（M1）：AI 投递文稿（readingPad remote，2s 轮询 loadReading，按 revision 去重）+ 作品章节
 *   （复用 writing remote 既有 HTTP RPC /api/writing/workspaceIndex 与 /api/writing/chapterText）。
 * - 排版：三主题（Paper/Sepia/Night CSS 变量）、字号 16-20（A⁻/A⁺）、限宽 ≤30em、首行缩进 2em（仅 <p>）、
 *   段距 0.8em、行距 1.6；进度细条 + 滚动位置 localStorage 持久化；章末「下一章」不自动跳转，首末章灰态。
 * - 偏好（主题/字号）localStorage 持久化；prefers-reduced-motion 关平滑滚动。
 * - 红线：纯展示，零文字处理；不写 canon/创作文件。
 */
import * as React from 'react';
import panelCss from './client.css';

const CSS_ID = 'dsh-reading-pad-css';
if (typeof document !== 'undefined' && document.querySelector(`style[data-plugin=${JSON.stringify(CSS_ID)}]`) === null) {
  const tag = document.createElement('style');
  tag.dataset.plugin = CSS_ID;
  tag.textContent = panelCss;
  document.head.appendChild(tag);
}

export const inject = ['remote', 'locale', 'slots', 'sidebarRightTabs'];

// 2026-09-13 解耦 dsh-better-sidebar（用户裁决）：注册到官方右侧栏 keyed 槽位。
const TAB_SLOT = 'sidebar.right.pane.tab';
const TAB_TITLE_SLOT = 'sidebar.right.pane.tab.title';
const TAB_ID = 'narrative-reading-pad';
const TAB_KIND = 'narrative-reading-pad';
const SEEN_KEY = 'narrative-reading-pad.seen-revision.v1';

/**
 * 2026-09-13（**关键修复**）：原生右侧栏 tab 需两步注册——① ctx.sidebarRightTabs.register(类型)
 * （决定它出现在「+」菜单并可被打开）② keyed 槽位提供 body/title。只做 ② 标签不出现
 * （用户截图实证：右侧栏只有官方「文件」）。第三方用 priority 'extension'。
 */
function registerRightbarTabType(ctx, spec) {
  if (typeof ctx.inject !== 'function') return;
  ctx.inject(['sidebarRightTabs'], (injected) => {
    const tabs = injected.get('sidebarRightTabs');
    if (tabs === undefined) return;
    ctx.effect(() => tabs.register({
      id: spec.id,
      kind: spec.kind,
      priority: 'extension',
      title: spec.title,
      ...(spec.guide === undefined ? {} : { guide: [{ order: spec.guide.order, title: spec.guide.title, description: spec.guide.description }] })
    }), 'narrative-reading-pad: right-sidebar tab type');
  });
}

const NS = 'narrativeReadingPad';
const zh = {
  title: '阅读板',
  hint: '沉浸式只读阅读：AI 投递的文稿与作品章节',
  sourceDelivery: 'AI 投递文稿',
  sourceChapters: '作品章节',
  sourceOutline: '大纲',
  sourceLore: 'lore / 人物卡',
  sourcePad: '写字板草稿',
  empty: '阅读板还是空的 —— 让 AI 用 reading_pad_send 投递一篇，或切到「作品章节」开始阅读。',
  noChapters: '当前写作工程还没有章节。',
  noProject: '当前会话没有找到写作工程（novel.json）。',
  loadError: '加载失败',
  retry: '重试',
  prev: '上一章',
  next: '下一章',
  nextEnd: '已是最后一章',
  theme: '主题',
  fontSmall: 'A⁻',
  fontLarge: 'A⁺',
  updatedAt: '更新',
  renderError: '阅读板渲染错误',
  restoreHint: '已恢复上次阅读位置',
  chapterCount: (n) => `共 ${n} 章`
};
const en = {
  title: 'Reading Pad',
  hint: 'Immersive read-only reading for delivered prose and chapters',
  sourceDelivery: 'AI Delivery',
  sourceChapters: 'Manuscript',
  sourceOutline: 'Outline',
  sourceLore: 'lore / profiles',
  sourcePad: 'Writing Pad Draft',
  empty: 'Nothing here yet — ask the AI to deliver text via reading_pad_send, or switch to Manuscript.',
  noChapters: 'No chapters in the current writing project.',
  noProject: 'No writing project (novel.json) in this session.',
  loadError: 'Load failed',
  retry: 'Retry',
  prev: 'Prev',
  next: 'Next',
  nextEnd: 'This is the last chapter',
  theme: 'Theme',
  fontSmall: 'A⁻',
  fontLarge: 'A⁺',
  updatedAt: 'Updated',
  renderError: 'Reading pad render error',
  restoreHint: 'Restored reading position',
  chapterCount: (n) => `${n} chapter(s)`
};

//#region 最小 strict codec（TypertSchema 接口仅需 parse()；避免内嵌 zod）
function strSchema() {
  return {
    parse(v) {
      if (typeof v !== 'string') throw new Error('expected string');
      return v;
    }
  };
}
function objSchema() {
  return {
    parse(v) {
      if (v === null || typeof v !== 'object' || Array.isArray(v)) throw new Error('expected object');
      return v;
    }
  };
}
function jsonParameter(name) {
  return {
    name,
    wire: name,
    source: 'json',
    codec: { mode: 'strict', typeSymbol: 'typescript#string', create: strSchema }
  };
}
function descriptor(method, parameters, resultSymbol) {
  return {
    id: `narrative-reading-pad#readingPad/${method}`,
    service: 'readingPad',
    namespace: 'readingPad',
    method,
    invocation: { kind: 'direct' },
    parameters,
    result: { mode: 'strict', typeSymbol: resultSymbol, create: objSchema }
  };
}
const TYPERT_REMOTE = {
  package: 'narrative-reading-pad',
  descriptors: [
    descriptor('saveReading', [jsonParameter('content'), jsonParameter('title'), jsonParameter('source')], 'narrative-reading-pad#SaveReadingResult'),
    descriptor('loadReading', [], 'narrative-reading-pad#LoadReadingResult')
  ]
};
//#endregion

//#region 阅读偏好（localStorage）
const PREFS_KEY = 'narrative-reading-pad.prefs.v1';
const SCROLL_KEY = 'narrative-reading-pad.scroll.v1';
function browserStorage() {
  try { return typeof window === 'undefined' ? null : window.localStorage; } catch { return null; }
}
function loadPrefs(storage = browserStorage()) {
  try {
    const raw = storage?.getItem(PREFS_KEY);
    if (raw === null || raw === undefined) return null;
    const p = JSON.parse(raw);
    if (p === null || typeof p !== 'object') return null;
    return {
      theme: p.theme === 'sepia' || p.theme === 'night' ? p.theme : 'paper',
      fontSize: typeof p.fontSize === 'number' && p.fontSize >= 16 && p.fontSize <= 20 ? p.fontSize : 17
    };
  } catch { return null; }
}
function savePrefs(prefs, storage = browserStorage()) {
  if (storage === null) return;
  try { storage.setItem(PREFS_KEY, JSON.stringify(prefs)); } catch { /* noop */ }
}
function loadScroll(storage = browserStorage()) {
  try {
    const raw = storage?.getItem(SCROLL_KEY);
    if (raw === null || raw === undefined) return null;
    const s = JSON.parse(raw);
    if (s === null || typeof s !== 'object') return null;
    return { chapterId: typeof s.chapterId === 'string' ? s.chapterId : '', ratio: typeof s.ratio === 'number' && s.ratio >= 0 && s.ratio <= 1 ? s.ratio : 0 };
  } catch { return null; }
}
function saveScroll(value, storage = browserStorage()) {
  if (storage === null) return;
  try { storage.setItem(SCROLL_KEY, JSON.stringify(value)); } catch { /* noop */ }
}
//#endregion

//#region 模块级 latestRevision（badge / 轮询共用）
const padState = { latestRevision: 0, hasNew: false };
//#endregion

//#region /api/writing RPC（与写作工作台同通道）
function rpc(method, args) {
  const id = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : 'r' + Date.now() + Math.random();
  return fetch('/api/writing/' + method, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ type: 'client-request', rpcId: id, method: 'writing/' + method, payload: { args: args || {} } })
  }).then((r) => r.json()).then((j) => (j && j.result) ? j.result : { ok: false, error: { message: 'rpc 响应异常' } })
    .catch((e) => ({ ok: false, error: { message: String((e && e.message) || e) } }));
}
//#endregion

//#region Markdown M1 渲染子集（基于写字板 renderMarkdown 扩展：GFM 表格 + URL 协议白名单）
const SAFE_URL_RE = /^(https?:\/\/|\/|\.{1,2}\/|#)/i;
function safeUrl(raw) {
  const s = String(raw).trim();
  if (!SAFE_URL_RE.test(s)) return null;
  return s;
}
function escapeHtml(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
function renderInline(text) {
  let s = text;
  s = s.replace(/`([^`]+)`/g, (_m, c) => '<code>' + c + '</code>');
  s = s.replace(/!\[([^\]]*)\]\(([^)\s]+)\)/g, (_m, alt, url) => {
    const u = safeUrl(url);
    return u === null ? escapeHtml('![' + alt + '](' + url + ')') : `<img src="${escapeHtml(u)}" alt="${escapeHtml(alt)}">`;
  });
  s = s.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_m, label, url) => {
    const u = safeUrl(url);
    return u === null ? escapeHtml('[' + label + '](' + url + ')') : `<a href="${escapeHtml(u)}">${label}</a>`;
  });
  s = s.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  s = s.replace(/\*([^*]+)\*/g, '<em>$1</em>');
  s = s.replace(/~~([^~]+)~~/g, '<del>$1</del>');
  return s;
}
/** GFM 表格：连续 `| a | b |` 行 + 分隔行 `|---|---|` → <table>。 */
function renderTable(lines, start, html) {
  const rows = [];
  let i = start;
  let header = null;
  while (i < lines.length && /^\s*\|.*\|\s*$/.test(lines[i]) && lines[i].trim() !== '') {
    rows.push(lines[i]);
    i += 1;
  }
  if (rows.length >= 2 && /^\s*\|?[\s:|-]+\|?$/.test(rows[1].replace(/\|/g, ' ')) && rows[1].includes('-')) {
    const cells = (line) => line.trim().replace(/^\||\|$/g, '').split('|').map((c) => c.trim());
    header = cells(rows[0]);
    const body = rows.slice(2).map((r) => cells(r));
    let out = '<table><thead><tr>' + header.map((c) => '<th>' + renderInline(escapeHtml(c)) + '</th>').join('') + '</tr></thead><tbody>';
    for (const r of body) out += '<tr>' + r.map((c) => '<td>' + renderInline(escapeHtml(c)) + '</td>').join('') + '</tr>';
    out += '</tbody></table>';
    html.push(out);
    return i;
  }
  // 不构成表格：按普通行回退（前两行按段落处理）
  html.push('<p>' + renderInline(escapeHtml(rows[0])) + '</p>');
  if (rows.length > 1) html.push('<p>' + renderInline(escapeHtml(rows[1])) + '</p>');
  if (rows.length > 2) html.push('<p>' + renderInline(escapeHtml(rows[2])) + '</p>');
  return start + Math.min(rows.length, 3);
}
function renderMarkdown(src) {
  const lines = String(src).replace(/\r\n/g, '\n').split('\n');
  const html = [];
  const codeBuf = [];
  const paragraph = [];
  let inCode = false;
  let listTag = null;
  const flushParagraph = () => {
    if (paragraph.length > 0) {
      html.push('<p>' + renderInline(escapeHtml(paragraph.join(' '))) + '</p>');
      paragraph.length = 0;
    }
  };
  const closeList = () => {
    if (listTag !== null) { html.push('</' + listTag + '>'); listTag = null; }
  };
  const ensureList = (tag) => {
    if (listTag !== tag) { closeList(); html.push('<' + tag + '>'); listTag = tag; }
  };
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.trim() === '') { flushParagraph(); closeList(); continue; }
    if (line.match(/^```([\w-]*)\s*$/)) {
      flushParagraph(); closeList();
      if (inCode) { html.push('<pre><code>' + escapeHtml(codeBuf.join('\n')) + '</code></pre>'); codeBuf.length = 0; inCode = false; }
      else inCode = true;
      continue;
    }
    if (inCode) { codeBuf.push(line); continue; }
    const heading = line.match(/^(#{1,6})\s+(.*)$/);
    if (heading) {
      flushParagraph(); closeList();
      const level = heading[1].length;
      html.push(`<h${level}>${renderInline(escapeHtml(heading[2]))}</h${level}>`);
      continue;
    }
    if (/^\s*([-*_])\s*\1\s*\1\s*$/.test(line)) { flushParagraph(); closeList(); html.push('<hr>'); continue; }
    if (/^>\s?/.test(line)) {
      flushParagraph(); closeList();
      html.push('<blockquote>' + renderInline(escapeHtml(line.replace(/^>\s?/, ''))) + '</blockquote>');
      continue;
    }
    // GFM 表格探测
    if (/^\s*\|.*\|\s*$/.test(line)) { flushParagraph(); closeList(); i = renderTable(lines, i, html) - 1; continue; }
    const ul = line.match(/^\s*[-*+]\s+(.*)$/);
    if (ul) { flushParagraph(); ensureList('ul'); html.push('<li>' + renderInline(escapeHtml(ul[1])) + '</li>'); continue; }
    const ol = line.match(/^\s*\d+[.)]\s+(.*)$/);
    if (ol) { flushParagraph(); ensureList('ol'); html.push('<li>' + renderInline(escapeHtml(ol[1])) + '</li>'); continue; }
    paragraph.push(line);
  }
  if (inCode) html.push('<pre><code>' + escapeHtml(codeBuf.join('\n')) + '</code></pre>');
  flushParagraph();
  closeList();
  return html.join('\n');
}
//#endregion

//#region 错误边界
class ReadingBoundary extends React.Component {
  constructor(props) { super(props); this.state = { error: null, stack: '' }; }
  static getDerivedStateFromError(error) { return { error, stack: error?.stack ?? String(error) }; }
  componentDidCatch(error, info) { console.error('[narrative-reading-pad]', error, info?.componentStack); }
  render() {
    if (this.state.error !== null) {
      return React.createElement('div', { className: 'nrp-error' },
        React.createElement('div', null, `${zh.renderError}：${String(this.state.error?.message ?? this.state.error)}`),
        React.createElement('pre', { style: { whiteSpace: 'pre-wrap', fontSize: 11 } }, String(this.state.stack ?? '').slice(0, 800)));
    }
    return this.props.children;
  }
}
//#endregion

//#region 章节源
function ChapterReader({ projectRoot, t }) {
  const [indexData, setIndexData] = React.useState(null);
  const [indexError, setIndexError] = React.useState('');
  const [current, setCurrent] = React.useState(null);       // { chapter, text }
  const [loadError, setLoadError] = React.useState('');
  const scrollRef = React.useRef(null);
  const [restored, setRestored] = React.useState(false);
  const [progress, setProgress] = React.useState(0);

  React.useEffect(() => {
    let alive = true;
    setIndexError('');
    if (typeof projectRoot !== 'string' || projectRoot.length === 0) {
      setIndexData({ missing: true });
      return () => { alive = false; };
    }
    rpc('workspaceIndex', { projectRoot }).then((r) => {
      if (!alive) return;
      if (r && r.ok && r.value) setIndexData(r.value);
      else if (r && r.ok) setIndexData({ missing: true });
      else setIndexError(String(r?.error?.message ?? 'workspaceIndex 失败'));
    });
    return () => { alive = false; };
  }, [projectRoot]);

  const chapters = React.useMemo(() => {
    const list = Array.isArray(indexData?.chapters) ? indexData.chapters : [];
    return list.map((c) => ({ id: c.id, title: c.title || '', words: c.words || 0 }));
  }, [indexData]);

  const currentIndex = React.useMemo(() => {
    if (current === null) return -1;
    return chapters.findIndex((c) => c.id === current.chapter.id);
  }, [current, chapters]);

  // 初次加载：恢复滚动位置
  React.useEffect(() => {
    if (restored) return;
    if (current === null) return;
    const saved = loadScroll();
    if (saved !== null && saved.chapterId === current.chapter.id) {
      requestAnimationFrame(() => {
        const el = scrollRef.current;
        if (el === null || el === undefined) return;
        el.scrollTop = (el.scrollHeight - el.clientHeight) * Math.min(1, Math.max(0, saved.ratio));
        setRestored(true);
      });
    } else {
      setRestored(true);
    }
  }, [current, restored]);

  // 滚动 → 进度条 + 持久化
  const onScroll = React.useCallback(() => {
    const el = scrollRef.current;
    if (el === null || el === undefined || current === null) return;
    const max = el.scrollHeight - el.clientHeight;
    const ratio = max > 0 ? Math.min(1, Math.max(0, el.scrollTop / max)) : 0;
    setProgress(ratio);
    saveScroll({ chapterId: current.chapter.id, ratio });
  }, [current]);

  function openChapter(index) {
    if (index < 0 || index >= chapters.length) return;
    const c = chapters[index];
    setLoadError('');
    setRestored(false);
    rpc('chapterText', { projectRoot, chapterId: c.id, opts: { cap: 0 } }).then((r) => {
      if (r && r.ok) {
        setCurrent({ chapter: { ...c, title: r.value?.title ?? c.title, words: r.value?.words ?? c.words }, text: String(r.value?.text ?? '') });
      } else {
        setLoadError(String(r?.error?.message ?? '章节加载失败'));
      }
    });
  }

  // 初始化打开第 1 章（恢复记忆的章节优先）
  React.useEffect(() => {
    if (current !== null || chapters.length === 0) return;
    const saved = loadScroll();
    const start = saved !== null ? Math.max(0, chapters.findIndex((c) => c.id === saved.chapterId)) : 0;
    openChapter(start >= 0 ? start : 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chapters]);

  if (indexError !== '') {
    return React.createElement('div', { className: 'nrp-note' }, `${zh.loadError}：${indexError}`,
      React.createElement('span', { className: 'nrp-link', onClick: () => { setIndexError(''); setIndexData(null); } }, ` · ${zh.retry}`));
  }
  if (indexData === null) {
    return React.createElement('div', { className: 'nrp-note' }, '…');
  }
  if (indexData && indexData.missing) {
    return React.createElement('div', { className: 'nrp-note' }, zh.noProject);
  }
  if (chapters.length === 0) {
    return React.createElement('div', { className: 'nrp-note' }, zh.noChapters);
  }
  if (current === null) {
    return React.createElement('div', { className: 'nrp-note' }, loadError !== '' ? `${zh.loadError}：${loadError}` : '…');
  }
  if (loadError !== '') {
    return React.createElement('div', { className: 'nrp-note' }, `${zh.loadError}：${loadError}`,
      React.createElement('span', { className: 'nrp-link', onClick: () => openChapter(currentIndex) }, ` · ${zh.retry}`));
  }

  const isFirst = currentIndex <= 0;
  const isLast = currentIndex >= chapters.length - 1;
  const titles = chapters.map((c) => c.title).join(' / ');

  return React.createElement('div', { className: 'nrp-reader' },
    React.createElement('div', { className: 'nrp-progress' },
      React.createElement('div', { className: 'nrp-progress-bar', style: { width: (progress * 100).toFixed(2) + '%' } })),
    React.createElement('div', { className: 'nrp-chapter-nav' },
      React.createElement('button', { className: 'nrp-btn', disabled: isFirst, onClick: () => openChapter(currentIndex - 1), title: isFirst ? zh.nextEnd : `${zh.prev}：${isFirst ? '' : chapters[currentIndex - 1]?.title}` }, zh.prev),
      React.createElement('span', { className: 'nrp-chapter-title', title: titles }, `${currentIndex + 1}/${chapters.length} · ${current.chapter.title}`),
      React.createElement('button', { className: 'nrp-btn', disabled: isLast, onClick: () => openChapter(currentIndex + 1), title: isLast ? zh.nextEnd : `${zh.next}：${isLast ? '' : chapters[currentIndex + 1]?.title}` }, zh.next)),
    React.createElement('div', { ref: scrollRef, className: 'nrp-scroll', onScroll: onScroll },
      React.createElement('article', { className: 'nrp-content' },
        React.createElement('h1', { className: 'nrp-chapter-h1' }, current.chapter.title),
        React.createElement('div', { className: 'nrp-prose', dangerouslySetInnerHTML: { __html: renderMarkdown(current.text) } }),
        React.createElement('div', { className: 'nrp-endline' },
          isLast
            ? React.createElement('span', { className: 'nrp-btn nrp-btn-ghost' }, zh.nextEnd)
            : React.createElement('button', { className: 'nrp-btn nrp-next', onClick: () => openChapter(currentIndex + 1) }, `${zh.next}：${chapters[currentIndex + 1]?.title ?? ''}`))),
      restored && loadScroll()?.chapterId === current.chapter.id
        ? React.createElement('div', { className: 'nrp-toast' }, zh.restoreHint)
        : null));
}
//#endregion

//#region AI 投递文稿源
function DeliveryReader({ bridge, t }) {
  const [revision, setRevision] = React.useState(-1);
  const [state, setState] = React.useState(null);
  const [error, setError] = React.useState('');
  const [loading, setLoading] = React.useState(true);

  async function poll(force) {
    try {
      const r = await bridge.loadReading();
      if (!r.ok) { setError(String(r.error?.message ?? 'loadReading 失败')); return; }
      setError('');
      if (force || r.revision !== revision) {
        setRevision(r.revision);
        setState({ current: r.current ?? null, history: Array.isArray(r.history) ? r.history : [] });
        padState.latestRevision = typeof r.revision === 'number' ? r.revision : padState.latestRevision;
      }
    } catch (e) {
      setError(String(e?.message ?? e));
    } finally {
      setLoading(false);
    }
  }
  React.useEffect(() => {
    void poll(true);
    const timer = globalThis.setInterval(() => { void poll(false); }, 2000);
    return () => globalThis.clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (error !== '') {
    return React.createElement('div', { className: 'nrp-note' }, `${zh.loadError}：${error}`,
      React.createElement('span', { className: 'nrp-link', onClick: () => { setLoading(true); void poll(true); } }, ` · ${zh.retry}`));
  }
  if (loading) return React.createElement('div', { className: 'nrp-note' }, '…');
  const current = state?.current ?? null;
  if (current === null) {
    return React.createElement('div', { className: 'nrp-note' }, zh.empty);
  }
  const when = current.updatedAt ? new Date(current.updatedAt).toLocaleString() : '';
  return React.createElement('div', { className: 'nrp-reader' },
    React.createElement('div', { className: 'nrp-delivery-head' },
      React.createElement('h1', { className: 'nrp-chapter-h1' }, current.title || ''),
      React.createElement('div', { className: 'nrp-delivery-meta' },
        React.createElement('span', { className: 'nrp-tag' }, current.source || 'ai-delivery'),
        when !== '' ? React.createElement('span', null, `${zh.updatedAt}：${when}`) : null)),
    React.createElement('div', { className: 'nrp-scroll nrp-no-progress' },
      React.createElement('article', { className: 'nrp-content' },
        React.createElement('div', { className: 'nrp-prose', dangerouslySetInnerHTML: { __html: renderMarkdown(current.content ?? '') } }))));
}
//#endregion

//#region 面板
function ReadingPanel({ bridge, scope, getCwd, t }) {
  const prefs0 = loadPrefs() ?? { theme: 'paper', fontSize: 17 };
  const [source, setSource] = React.useState('delivery');
  const [theme, setTheme] = React.useState(prefs0.theme);
  const [fontSize, setFontSize] = React.useState(prefs0.fontSize);

  const [projectRoot, setProjectRoot] = React.useState(() => {
    const cwd = scope?.cwd;
    return typeof cwd === 'string' && cwd.length > 0 ? cwd : '';
  });

  // 对齐写作工作台 getCwd：scope.cwd 缺失时走 apply 传入的 describe 兜底（避免空根显示"…"）
  React.useEffect(() => {
    if (typeof projectRoot === 'string' && projectRoot.length > 0) return;
    if (typeof getCwd !== 'function') return;
    let alive = true;
    getCwd().then((cwd) => { if (alive && typeof cwd === 'string' && cwd.length > 0) setProjectRoot(cwd); }).catch(() => { /* 留空态 */ });
    return () => { alive = false; };
  }, [projectRoot, getCwd]);

  const setPref = (patch) => {
    const next = { theme, fontSize, ...patch };
    setTheme(next.theme); setFontSize(next.fontSize);
    savePrefs(next);
  };

  const sources = [
    { key: 'delivery', label: t('sourceDelivery'), on: true },
    { key: 'chapters', label: t('sourceChapters'), on: true },
    { key: 'outline', label: t('sourceOutline'), on: false },
    { key: 'lore', label: t('sourceLore'), on: false },
    { key: 'pad', label: t('sourcePad'), on: false }
  ];

  return React.createElement('div', { className: `nrp-root nrp-theme-${theme}`, style: { '--nrp-font-size': fontSize + 'px' } },
    React.createElement('div', { className: 'nrp-toolbar' },
      React.createElement('div', { className: 'nrp-sources' },
        sources.map((s) => React.createElement('button', {
          key: s.key,
          className: 'nrp-source' + (source === s.key ? ' nrp-source-active' : '') + (s.on ? '' : ' nrp-source-off'),
          disabled: !s.on,
          onClick: () => setSource(s.key),
          title: s.on ? s.label : `${s.label}（二期）`
        }, s.label))),
      React.createElement('div', { className: 'nrp-toolbar-right' },
        React.createElement('button', { className: 'nrp-btn', onClick: () => setPref({ fontSize: Math.max(16, fontSize - 1) }), disabled: fontSize <= 16, title: t('fontSmall') }, t('fontSmall')),
        React.createElement('span', { className: 'nrp-font-badge' }, `${fontSize}px`),
        React.createElement('button', { className: 'nrp-btn', onClick: () => setPref({ fontSize: Math.min(20, fontSize + 1) }), disabled: fontSize >= 20, title: t('fontLarge') }, t('fontLarge')),
        React.createElement('span', { className: 'nrp-theme-switch' },
          ['paper', 'sepia', 'night'].map((th) => React.createElement('button', {
            key: th,
            className: 'nrp-btn nrp-theme-btn' + (theme === th ? ' nrp-theme-btn-active' : ''),
            onClick: () => setPref({ theme: th }),
            title: `${t('theme')}：${th}`
          }, th === 'paper' ? '📄' : th === 'sepia' ? '📜' : '🌙'))))),
    React.createElement('div', { className: 'nrp-body' },
      source === 'delivery'
        ? React.createElement(DeliveryReader, { bridge, t })
        : React.createElement(ChapterReader, { projectRoot, t })));
}
//#endregion

//#region apply：locale + remote 挂载 + bridge + tab 注册（1s 轮询 + disposer）
export async function apply(ctx) {
  ctx.effect(() => ctx.locale.register(NS, { zh, en }), 'narrative-reading-pad: dictionaries');
  const t = ctx.locale.bind(NS);

  registerRightbarTabType(ctx, {
    id: TAB_ID,
    kind: TAB_KIND,
    title: () => t('title'),
    guide: { order: 30, title: () => t('title'), description: () => t('hint') }
  });

  // 对齐写作工作台 getCwd：会话 cwd 缺失时的兜底（connection describe）
  const getCwd = () => {
    try {
      const c = ctx.get('connection');
      if (c && c.api && c.api.host && c.api.host.describe) {
        return c.api.host.describe({}).then((r) => ((r && r.value && r.value.cwd) ? r.value.cwd : '')).catch(() => '');
      }
    } catch { /* noop */ }
    return Promise.resolve('');
  };

  const disposeRemote = await ctx.remote.$mount(TYPERT_REMOTE);
  const bridge = await new Promise((resolve, reject) => {
    try {
      ctx.plugin({
        name: 'reading-pad-bridge',
        inject: ['remote.readingPad'],
        apply(cctx) {
          const ns = cctx.remote.readingPad;
          const unwrap = (p) => p.then((r) => {
            if (r && r.ok) return r.value;
            throw new Error(r && r.error ? String(r.error.message || r.error) : 'readingPad 调用失败');
          });
          resolve({
            saveReading: (content, title, source) => unwrap(ns.saveReading(content, title, source)),
            loadReading: () => unwrap(ns.loadReading())
          });
        }
      }).then(() => void 0, (error) => reject(error));
    } catch (error) { reject(error); }
  });

  let disposed = false;
  let tabRegistered = false;
  let tabTimer = null;
  const slotDisposers = [];

  const unseenBadge = () => {
    try {
      const seen = Number(browserStorage()?.getItem(SEEN_KEY) ?? 0);
      return padState.latestRevision > seen ? '新' : null;
    } catch { return null; }
  };
  const markSeen = () => {
    try { browserStorage()?.setItem(SEEN_KEY, String(padState.latestRevision)); } catch { /* noop */ }
  };

  /** tab 主体：挂载即视为「已读」（替代 better-sidebar 的 onActivate 钩子）。 */
  function TabBody(props) {
    React.useEffect(() => { markSeen(); }, []);
    return React.createElement(ReadingBoundary, null,
      React.createElement(ReadingPanel, { bridge, scope: props?.scope, getCwd, t }));
  }

  /** tab 标题：📖＋标题＋未读徽标（2s 轮询，替代 better-sidebar 的 badge 钩子）。 */
  function TabTitle() {
    const [badge, setBadge] = React.useState(() => unseenBadge());
    React.useEffect(() => {
      const timer = globalThis.setInterval(() => setBadge(unseenBadge()), 2000);
      return () => globalThis.clearInterval(timer);
    }, []);
    return React.createElement('span', { style: { display: 'inline-flex', alignItems: 'center', gap: 6 } },
      React.createElement('span', { style: { fontSize: 14 } }, '📖'),
      t('title'),
      badge === null ? null : React.createElement('span', {
        style: { fontSize: 10, lineHeight: '14px', padding: '0 4px', borderRadius: 6, background: 'var(--dsh-accent, #2f7d5d)', color: '#fff' }
      }, badge));
  }

  function registerReadingTab() {
    if (disposed) return true;
    if (typeof ctx.slots?.inject !== 'function') return false;
    try {
      slotDisposers.push(ctx.slots.inject(TAB_SLOT, () => ctx.slots.register({
        name: TAB_SLOT, key: TAB_ID, order: 30, locale: NS, inject: (sessionId) => ({ sessionId })
      }, TabBody)));
      slotDisposers.push(ctx.slots.inject(TAB_TITLE_SLOT, () => ctx.slots.register({
        name: TAB_TITLE_SLOT, key: TAB_ID
      }, TabTitle)));
      tabRegistered = true;
      return true;
    } catch (e) {
      console.error('[narrative-reading-pad] native tab register failed', e);
      return false;
    }
  }
  if (!registerReadingTab()) {
    tabTimer = globalThis.setInterval(() => { if (registerReadingTab()) globalThis.clearInterval(tabTimer); }, 1000);
  }
  return () => {
    disposed = true;
    if (tabTimer !== null) globalThis.clearInterval(tabTimer);
    for (const dispose of slotDisposers) { try { dispose?.(); } catch { /* 忽略 */ } }
    slotDisposers.length = 0;
    disposeRemote();
  };
}
//#endregion
