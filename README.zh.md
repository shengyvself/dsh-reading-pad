<p align="center">
  <img src="assets/logo.svg" width="96" alt="dsh-reading-pad logo">
</p>

<h1 align="center">dsh-reading-pad</h1>

<p align="center">
  <strong>沉浸式只读阅读板</strong> —— AI 把排版好的文字推给你，你在 DSH 右侧栏舒服地读；也可以直接翻当前写作工程的章节。
</p>

<p align="center">
  <a href="https://github.com/shengyvself/dsh-reading-pad/releases">
    <img src="https://img.shields.io/github/v/release/shengyvself/dsh-reading-pad?style=flat-square&label=release&color=4D6BFE" alt="Release">
  </a>
  <a href="https://github.com/shengyvself/dsh-reading-pad">
    <img src="https://img.shields.io/github/stars/shengyvself/dsh-reading-pad?style=flat-square&label=stars&color=4D6BFE" alt="Stars">
  </a>
  <img src="https://img.shields.io/badge/license-Apache--2.0-0B7285?style=flat-square" alt="Apache-2.0">
  <img src="https://img.shields.io/badge/DSH-0.1.5--rc.2+-4D6BFE?style=flat-square" alt="DSH 0.1.5-rc.2+">
  <img src="https://img.shields.io/badge/Web-4D6BFE?style=flat-square" alt="DSH Web">
</p>

<p align="center">
  <a href="./README.md">English</a> · <strong>中文</strong>
</p>

<p align="center">
  <a href="assets/hero.svg">
    <img src="assets/hero.svg" width="100%" alt="三主题预览：Paper / Sepia / Night，含进度条与章节信息">
  </a>
</p>

## 你拿到什么

- 📖 **AI 投递文稿** —— 让 AI 用 `reading_pad_send` 工具把排版好的 Markdown 推进阅读板，你只管读；正文原样展示，不做任何文字处理。
- 📚 **作品章节浏览** —— 切换「作品章节」模式，直接翻当前写作工程里的章节，不用打开写作工作台。
- 🎨 **三套护眼主题** —— Paper（暖白）/ Sepia（米黄）/ Night（深灰），一键切换，自动记住你的选择。
- 📐 **30em 限宽排版** —— 行宽固定在 30em（约 30 个汉字），行距 1.6，首行缩进 2em，段距 0.8em——按纸质书节奏设计，眼睛不累。
- 🔤 **A⁻ / A⁺ 字号** —— 在 16–20px 之间调，随字号变化自动重排。
- 📊 **进度条 + 章节浏览** —— 顶部细条显示当前章节进度，章末「下一章」按钮不自动跳转（避免误翻），首/末章灰态。
- 💾 **滚动位置持久化** —— 关掉 tab 再打开，从你上次停下的位置继续读。
- 🔔 **新内容提示** —— AI 投了新稿但 tab 未看时，tab 标题带「新」徽标，不主动抢焦点。

## Install

```sh
dsh plugin --profile web add dsh-reading-pad
```

安装后**重启 `dsh web`**，然后打开右侧栏 → 从「+」菜单添加「📖 阅读板」tab。

**Requires DSH client packages >=0.1.5-rc.2.** 使用官方原生右侧栏 keyed 槽位（`sidebar.right.pane.tab`），**不依赖** `dsh-better-sidebar`。

也可以从 GitHub 直装（不走 npm）：

```sh
dsh plugin --profile web add github:shengyvself/dsh-reading-pad
```

## 用它能干嘛

装好后，直接跟 AI 说：

- "把这篇稿子推到阅读板里" —— AI 会用 `reading_pad_send` 把已排版好的 Markdown 投递进来
- "读第一章" —— 切到「作品章节」模式，翻当前写作工程的第一章
- "换成 Night 主题" —— 切换暗色护眼模式
- "字号调大一点" —— 按 A⁺ 放大

阅读板不主动发起任何动作，只在你或 AI 触发时展示内容。

## 内容源

| 源 | 说明 |
|---|---|
| **AI 投递文稿** | AI 调用 `reading_pad_send` 工具 → 阅读板展示。排版由 AI 全权负责，阅读板零文字处理、原样渲染。 |
| **作品章节** | 客户端复用写作模块既有的 HTTP RPC（`/api/writing/workspaceIndex` 与 `/api/writing/chapterText`），直接读取当前写作工程的章节列表与全文。 |

大纲 / lore / 写字板草稿为二期占位（灰态）。

## 兼容性

| 场景 | DSH 版本 | 插件版本 |
|---|---|---|
| **推荐** | **`0.1.5-rc.2+`**（当前维护版） | **`0.1.0`** |
| 最低兼容 | `0.1.5-rc.2+` | `0.1.0` |

安装插件**不会**升级宿主 DSH。peerDependencies 声明的最低客户端包版本是 `>=0.1.5-rc.2`，实测在 `0.1.5-rc.2` 上跑通。

## Security

阅读板是**只读消费端**，行为边界明确：

- 只写本地插件状态文件（`~/.dsh/<state>.json`，会话展示文本 + 历史 ≤20 条 FIFO），**不触碰** canon / 创作文件。
- 不引入重型第三方 Markdown 渲染库；Markdown 渲染为纯前端 M1 子集（标题/段落/粗斜/删除线/行内代码/链接图片/单层列表/引用/分隔线/围栏代码块/GFM 表格），HTML 全转义，URL 仅允许 `http` / `https` / 相对路径。
- 不联网。除复用宿主既有的 `/api/writing/*` HTTP RPC 之外，无对外网络请求。

完整策略见 [`SECURITY.md`](./SECURITY.md)。

## 依赖说明

服务端依赖（`@deepseek-ai/dsh-tools`、`@deepseek-ai/dsh-typert-protocol`）**声明在 `peerDependencies`**——由宿主 DSH 提供，不写入 `dependencies`（避免清单面遮蔽宿主版本）。客户端包走 `peerDependencies`（cordis / dsh-client-* / react）。

v0.1.0 起已**解耦 `dsh-better-sidebar`**：注册到官方原生 keyed 槽位（`sidebar.right.pane.tab` + `.title`），通过 `ctx.sidebarRightTabs.register` 两步注册。

## 构建

```bash
node scripts/build.mjs   # 服务端 ESM 复制 + 客户端 esbuild 打浏览器 CJS（ModuleLoader 包装 id=dsh-reading-pad）
```

## 开发

见 [`CONTRIBUTING.md`](./CONTRIBUTING.md)、[`ARCHITECTURE.md`](./ARCHITECTURE.md)、[`CHANGELOG.md`](./CHANGELOG.md)。

## License

[Apache License 2.0](./LICENSE) © shengyvself
