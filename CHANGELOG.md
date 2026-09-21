# Changelog — dsh-reading-pad

本文件记录 **dsh-reading-pad**（阅读板：AI 投递文稿 + 作品章节的沉浸式只读阅读（三主题/限宽排版/进度条/章节浏览），官方右侧栏 tab）的版本变更。
版本号唯一真相＝`package.json`；升版一律走 dsh-reading-pad 根目录的
`node scripts/arch-version.mjs --commit <name>`（补丁）或 `--commit-minor <name>`（中版本），**勿手改**。

> 2026-09-13 补建：本模块此前**无独立 CHANGELOG**（架构级 `dsh-reading-pad/CHANGELOG.md` 有记，
> 模块目录缺文件——`--check` 不校验模块级日志故一直未被发现）。以下条目据**架构 CHANGELOG 的组件行**
> 与**维护会话**回填，覆盖 0.0.x → 0.1.0 全量。

## 0.1.1 — 2026-09-21
- **0.1.6 typert strict codec 适配**：DSH 0.1.6 收紧 typert 协议——strict codec 必须提供 `create()` 工厂；rc.5 时代的内联 `schema: xxx()` 写法令**客户端** `apply()` 抛错，页面报 `web boot: N entry did not activate`；**服务端 journal 一行都不报**（装饰器自动生成路径不受影响），只能从浏览器侧验收。
  - **改动**：`src/client.js` 与 `lib/client.js` 的 `codec` / `result` 两处 `schema: xxx()` → `create: xxx`（共 2 处 × 2 文件 = 4 处，实际源 2 行 + 构建产物 2 行）。
  - **本插件特殊性**：dsh-reading-pad 是本仓内**唯一**手写 typert 描述符的插件（`descriptor()` + `TYPERT_REMOTE`），故是 0.1.6 升级的必改点；无其他调用面。
  - **验收**：`node --check src/client.js` 通过；`lib/client.js` build 产物与 src 一致；浏览器侧 0.1.6 环境客户端激活后无 `web boot: N entry did not activate` 报错。

## 0.1.0 — 2026-09-13
- **中版本里程碑**（用户指令）。登记性变更，无额外代码改动。

## 0.0.5 — 2026-09-13
- **修复：原生右侧栏 tab 需「两步注册」**——补 `ctx.sidebarRightTabs.register(...)`＋guide 条目（见 §九十六）。此前只注册 keyed 槽位 ⇒ tab 不出现。

## 0.0.4 — 2026-09-13
- **0.1.5-rc.2 适配**：客户端与 **dsh-better-sidebar 解耦** → 官方 keyed 槽位 `sidebar.right.pane.tab`/`.title`；`badge`→标题内 2s 轮询、`onActivate`→面板挂载即标记已读；`dsh.client.inject` 补 `dsh-client-ui-sidebar-right`。

## 0.0.3 — 2026-09-05
- **依赖声明卫生**：`dsh-tools`/`dsh-typert-protocol` 由 `dependencies` 移入 `peerDependencies`（DSH 共享宿主包由宿主提供，防清单面遮蔽宿主版本；对齐 writing 模块同构）。

## 0.0.2 — 2026-09-04
- **阅读板 P0 落地**（用户直传任务书，设计=`设计/阅读板设计.md`）：`ReadingPadService`＋`reading_pad_send` 工具＋`~/.dsh` 状态文件；better-sidebar tab 📖／三主题／30em 限宽／首行缩进 2em／字号 16–20／M1 渲染子集（含 GFM 表格）／章节浏览／进度条＋滚动持久化／2s 轮询＋badge／错误边界。
- 前置小改：writing `remote.chapterText` 支持 `cap<=0` 全文（缺省 12k 兼容）。

## 0.0.1 — 2026-09-04
- 模块建立（随 P0 落地；架构 `--commit` 中 reading-pad 0.0.1→0.0.2）。
