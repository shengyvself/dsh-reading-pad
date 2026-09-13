# dsh-reading-pad

dsh-reading-pad 自有阅读板（better-sidebar tab `narrative-reading-pad`，📖「阅读板」，single，order 30）。

## 定位

**只读消费端**：最大化阅读体验的沉浸式阅读面板。模型通过 `reading_pad_send` 把已排版好的 Markdown 投递进来（AI 投递文稿源），或直接阅读当前写作工程的作品章节（作品章节源）。排版由 AI 在投递前全权负责——阅读板零文字处理、原样渲染展示。

## 内容源（M1）

| 源 | 通道 |
|---|---|
| AI 投递文稿 | `reading_pad_send` 工具 → `ReadingPadService`（remote `readingPad`，`saveReading`/`loadReading`）→ `~/.dsh/narrative-reading-pad-state.json`（单当前篇 + 历史 ≤20 FIFO） |
| 作品章节 | 客户端复用写作 remote 既有 HTTP RPC `/api/writing/workspaceIndex` 与 `/api/writing/chapterText`（`{cap: 0}` 全文） |

大纲 / lore / 写字板草稿为二期占位（灰态）。

## 视觉参数（设计 §二）

- 行宽 `max-width: min(100% - 2em, 30em)`；字体 `Noto Serif CJK SC / Source Han Serif SC / Songti SC, serif`；行距 1.6；字号 16–20（A⁻/A⁺）
- 首行缩进 2em（仅正文 `<p>`；列表/引用/代码不缩进）；段距 0.8em
- 三主题：Paper `#faf9f6/#3b3b3b`、Sepia `#f5ecd9/#4a4438`、Night `#1e1e1e/#b0b0b0`
- 章内滚动 + 进度细条；滚动位置（当前章节 + 比例）localStorage 持久化；章末「下一章」按钮不自动跳转；首/末章灰态
- 2s 轮询 `loadReading`（revision 去重）；tab 未看时 better-sidebar badge「新」；默认不自动 openTab

## 红线

- 只写 `~/.dsh/narrative-reading-pad-state.json`（会话展示文本），不触碰 canon/创作文件。
- 不引重型第三方渲染库；Markdown 渲染为纯前端 M1 子集（标题/段落/粗斜/删除线/行内代码/链接图片/单层列表/引用/分隔线/围栏代码块/GFM 表格），HTML 转义、URL 仅 `http/https/相对路径`。

## 构建

```bash
node scripts/build.mjs   # 服务端 ESM 复制 + 客户端 esbuild 打浏览器 CJS（ModuleLoader 包装 id=dsh-reading-pad）
```

## 依赖说明

- 服务端依赖（`@deepseek-ai/dsh-tools`、`@deepseek-ai/dsh-typert-protocol`）**声明在 peerDependencies**（DSH 共享宿主包，由宿主提供；**不得写入 dependencies**——那会导致清单面遮蔽宿主版本）；
  模块自身 `node_modules/@deepseek-ai/` 为指向 DSH 运行时的链接（与 writing/writing-pad 同款，避免 cordis/协议双副本；运行期解析以该链接为准，与清单 peer 声明一致）。
- 客户端包走 peerDependencies（cordis / dsh-client-* / react）。
