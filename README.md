# 📖 Reading Pad（阅读板）

沉浸式只读阅读面板 · DeepSeek Harness 插件 · Apache-2.0

> 定位：把「写」和「读」分离——AI 把已排版好的文本投递进来，人在专属阅读界面读；阅读板**零文字处理、原样展示**，长文不再挤占对话流。

## 一句话简介

Reading Pad 是 DSH 的沉浸式阅读板：模型通过 `reading_pad_send` 把成稿/长文投进侧栏「📖 阅读板」tab，用户在三套低蓝光主题、30em 限宽排版的专属界面中阅读。

## 核心功能

- **AI 投递文稿**：模型用 `reading_pad_send` 投递已排版 Markdown（含可选 title/source），服务端只做结构性校验、零文字处理，原样持久化并展示；2s 轮询实时刷新、tab 未读显示「新」角标。
- **作品章节（只读）**：复用写作子系统数据通道，按当前工程 manifest 浏览章节全文；上一章/下一章切换、章末「下一章」按钮（不自动跳转）、首末章灰态。
- **三套主题**：Paper（米白 `#faf9f6`/正文 `#3b3b3b`，≈10.6:1）、Sepia（暖黄 `#f5ecd9`/`#4a4438`，≈8.2:1）、Night（低蓝光深灰 `#1e1e1e`/`#b0b0b0`，≈7.7:1）——避开纯黑白极端对比。
- **舒适排版**：正文限宽 `min(100% - 2em, 30em)`（≈30 中文字/行，窄容器自动回落）；首行缩进 2em（仅正文段落）；段距 0.8em；行距 1.6；字号 16–20px（A⁻/A⁺ 循环）；衬线字体栈（Noto Serif CJK SC / Source Han Serif SC / Songti SC / serif）。
- **阅读连续**：章内滚动 + 顶部进度细条；滚动位置（当前章节 + 比例）localStorage 持久化，刷新回位；`prefers-reduced-motion` 时关闭平滑滚动。
- **章节浏览**：内容源切换骨架（AI 投递文稿 / 作品章节两条为实，大纲/lore/写字板草稿为二期占位）；章末「下一章」按钮不自动跳转（首末章灰态）。
- **稳健性**：空态/加载失败态/渲染错误边界；异常状态文件静默降级不崩；移动端 <768px 全宽抽屉适配。
- **M1 渲染子集（纯前端）**：标题 / 段落 / 粗体斜体删除线 / 行内代码 / 链接图片 / 单层有序无序列表 / 引用 / 分隔线 / 围栏代码块 / GFM 表格；全部 HTML 转义，链接图片仅允许 `http/https/相对路径`（拦截危险协议）；不引重型第三方渲染库。

## 设计依据

排版参数以人类舒适阅读的生理心理研究为据（视域限制→限宽 30em、回扫疲劳→行距 1.6、蓝光滤除→暖底/深底主题、对比度避开纯黑白极端 21:1）。阅读板只负责展示——**文字组织与排版由 AI 投递前全权负责**，投递进阅读板的即是已排版好的文本，阅读板原样渲染。

## 技术形态

- better-sidebar tab（`dsh-reading-pad`，📖，single，order 30），1s 轮询注册 + 幂等防重；
- 服务端 `ReadingPadService`（Typert remote `readingPad`）：`saveReading` / `loadReading`，状态持久化到 DSH home `~/.dsh/dsh-reading-pad-state.json`（单当前篇 + 历史 ≤20 FIFO，只存不进 UI）；
- 模型写入口 `reading_pad_send`：`content`（必填）`title`（可选）`source`（可选，缺省 `ai-delivery`），返回短确认 `{ok, error, revision}` 不回显全文；
- 客户端 esbuild 打包（roundtable 同构，`__ModuleLoader__` 包装）；DSH 共享宿主包走 peerDependencies，模块自身 node_modules 链接 DSH 运行时（无重复副本）。

## 安装

- **随附安装**：作为写作架构聚合包的模块随附安装（better-sidebar 宿主）；安装到 DSH web profile 后，侧栏「+」新 tab 可选「阅读板」，模型即可用 `reading_pad_send` 投递文本。
- **独立安装**：`git clone` 本仓 → `npm ci`（仅 esbuild）→ `npm run build` → 按 DSH 插件装配方式加载（bundle patch `cordis.patch.yml`；`@deepseek-ai/*` 与 `react` 由 DSH 宿主提供）。
- 作品章节源依赖写作架构（writing workspace）的 HTTP RPC 通道；仅有「AI 投递文稿」源时其余功能完整可用。

## 版本与许可

- 当前版本：**v0.0.3**（Apache-2.0）。
- 开源发布预检通过（无内部路径/私有 ID/密钥残留）。
