window.__ModuleLoader__.load({ id: "dsh-reading-pad", factory: (require) => { var module = { exports: {} }; var exports = module.exports;
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/client.js
var client_exports = {};
__export(client_exports, {
  apply: () => apply,
  inject: () => inject
});
module.exports = __toCommonJS(client_exports);
var React = __toESM(require("react"), 1);

// src/client.css
var client_default = '/* dsh-reading-pad \u9605\u8BFB\u677F\u6837\u5F0F\uFF08\u4E09\u4E3B\u9898 CSS \u53D8\u91CF\uFF1B\u8BBE\u8BA1 \xA7\u4E8C \u6570\u503C\uFF09 */\n.nrp-root {\n  --nrp-font-size: 17px;\n  --nrp-line-height: 1.6;\n  --nrp-measure: 30em;\n  display: flex;\n  flex-direction: column;\n  height: 100%;\n  min-height: 0;\n  overflow: hidden;\n  color: var(--nrp-fg, #3b3b3b);\n  background: var(--nrp-bg, #faf9f6);\n}\n\n/* \u4E09\u4E3B\u9898\uFF1APaper / Sepia / Night\uFF08\u8BBE\u8BA1 \xA7\u4E8C \u8272\u503C\uFF09 */\n.nrp-theme-paper {\n  --nrp-bg: #faf9f6;\n  --nrp-fg: #3b3b3b;\n  --nrp-muted: #8a8578;\n  --nrp-card: #f2efe7;\n  --nrp-border: rgba(59, 59, 59, 0.14);\n  --nrp-accent: #7a7566;\n  --nrp-code-bg: #f0ece2;\n}\n.nrp-theme-sepia {\n  --nrp-bg: #f5ecd9;\n  --nrp-fg: #4a4438;\n  --nrp-muted: #968c78;\n  --nrp-card: #ecdfc4;\n  --nrp-border: rgba(74, 68, 56, 0.16);\n  --nrp-accent: #8a7c5f;\n  --nrp-code-bg: #ecdfc4;\n}\n.nrp-theme-night {\n  --nrp-bg: #1e1e1e;\n  --nrp-fg: #b0b0b0;\n  --nrp-muted: #77736a;\n  --nrp-card: #262626;\n  --nrp-border: rgba(176, 176, 176, 0.16);\n  --nrp-accent: #8f8b80;\n  --nrp-code-bg: #262626;\n}\n\n.nrp-toolbar {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 8px;\n  padding: 8px 10px 6px;\n  border-bottom: 1px solid var(--nrp-border);\n  flex: none;\n  flex-wrap: wrap;\n}\n.nrp-sources { display: flex; gap: 4px; flex-wrap: wrap; }\n.nrp-source {\n  border: 1px solid var(--nrp-border);\n  background: transparent;\n  color: var(--nrp-fg);\n  font-size: 12px;\n  padding: 4px 9px;\n  border-radius: 8px;\n  cursor: pointer;\n  opacity: 0.92;\n}\n.nrp-source-active { background: var(--nrp-card); font-weight: 600; }\n.nrp-source-off { opacity: 0.42; cursor: not-allowed; }\n.nrp-toolbar-right { display: flex; align-items: center; gap: 4px; }\n.nrp-font-badge { font-size: 11px; color: var(--nrp-muted); min-width: 34px; text-align: center; }\n.nrp-theme-switch { display: inline-flex; gap: 2px; margin-left: 4px; }\n.nrp-btn {\n  border: 1px solid var(--nrp-border);\n  background: transparent;\n  color: var(--nrp-fg);\n  font-size: 12px;\n  padding: 4px 9px;\n  border-radius: 8px;\n  cursor: pointer;\n  line-height: 1.4;\n}\n.nrp-btn:disabled { opacity: 0.38; cursor: default; }\n.nrp-theme-btn-active { background: var(--nrp-card); }\n\n.nrp-body { flex: 1 1 auto; min-height: 0; display: flex; flex-direction: column; }\n\n/* \u9605\u8BFB\u533A\uFF1A\u9650\u5BBD\uFF0830em\uFF1B\u7A84\u5BB9\u5668\u81EA\u52A8\u56DE\u843D\uFF09\u3001\u6EDA\u52A8 */\n.nrp-reader { flex: 1 1 auto; min-height: 0; display: flex; flex-direction: column; position: relative; }\n.nrp-progress { height: 3px; background: var(--nrp-border); flex: none; }\n.nrp-progress-bar { height: 100%; background: var(--nrp-accent); transition: width 0.12s ease-out; }\n.nrp-scroll {\n  flex: 1 1 auto;\n  min-height: 0;\n  overflow-y: auto;\n  scroll-behavior: smooth;\n}\n@media (prefers-reduced-motion: reduce) {\n  .nrp-scroll { scroll-behavior: auto; }\n}\n.nrp-scroll.nrp-no-progress { overflow-y: auto; }\n\n/* \u6B63\u6587\uFF1Amax-width: min(100% - 2em, 30em)\uFF08\u8BBE\u8BA1 \xA7\u4E8C \u884C\u5BBD\uFF09 */\n.nrp-content {\n  max-width: min(100% - 2em, var(--nrp-measure));\n  margin: 0 auto;\n  padding: 1.2em 0 3em;\n  font-family: "Noto Serif CJK SC", "Source Han Serif SC", "Songti SC", serif;\n  font-size: var(--nrp-font-size);\n  line-height: var(--nrp-line-height);\n  color: var(--nrp-fg);\n  word-break: break-word;\n}\n.nrp-chapter-h1 {\n  font-size: 1.35em;\n  font-weight: 600;\n  margin: 0 0 1em;\n  text-align: center;\n}\n/* \u9996\u884C\u7F29\u8FDB 2em\uFF08\u4EC5\u6B63\u6587\u6BB5\u843D\uFF1B\u5217\u8868/\u5F15\u7528/\u4EE3\u7801\u4E0D\u7F29\u8FDB\uFF09*/\n.nrp-prose > p {\n  text-indent: 2em;\n  margin: 0 0 0.8em;\n}\n.nrp-prose > p:first-child { margin-top: 0; }\n.nrp-prose h1, .nrp-prose h2, .nrp-prose h3,\n.nrp-prose h4, .nrp-prose h5, .nrp-prose h6 {\n  margin: 1.3em 0 0.7em;\n  text-indent: 0;\n  line-height: 1.35;\n}\n.nrp-prose h1 { font-size: 1.3em; }\n.nrp-prose h2 { font-size: 1.2em; }\n.nrp-prose h3 { font-size: 1.1em; }\n.nrp-prose ul, .nrp-prose ol { margin: 0 0 0.8em; padding-left: 2.6em; }\n.nrp-prose li { margin: 0.2em 0; text-indent: 0; }\n.nrp-prose blockquote {\n  margin: 0 0 0.8em;\n  padding: 0.2em 1em;\n  border-left: 3px solid var(--nrp-border);\n  color: var(--nrp-muted);\n  text-indent: 0;\n}\n.nrp-prose hr { border: none; border-top: 1px solid var(--nrp-border); margin: 1.4em 0; }\n.nrp-prose code {\n  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;\n  font-size: 0.9em;\n  background: var(--nrp-code-bg);\n  padding: 0.1em 0.35em;\n  border-radius: 4px;\n}\n.nrp-prose pre {\n  background: var(--nrp-code-bg);\n  border: 1px solid var(--nrp-border);\n  border-radius: 8px;\n  padding: 0.8em 1em;\n  overflow-x: auto;\n  margin: 0 0 0.8em;\n  text-indent: 0;\n}\n.nrp-prose pre code { background: transparent; padding: 0; font-size: 0.85em; }\n.nrp-prose a { color: var(--nrp-accent); }\n.nrp-prose img { max-width: 100%; height: auto; }\n.nrp-prose table {\n  border-collapse: collapse;\n  margin: 0 0 0.8em;\n  font-size: 0.92em;\n  text-indent: 0;\n  display: block;\n  overflow-x: auto;\n}\n.nrp-prose th, .nrp-prose td {\n  border: 1px solid var(--nrp-border);\n  padding: 0.35em 0.7em;\n  text-align: left;\n}\n.nrp-prose th { background: var(--nrp-card); font-weight: 600; }\n\n.nrp-chapter-nav {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n  padding: 6px 10px;\n  border-bottom: 1px solid var(--nrp-border);\n  flex: none;\n}\n.nrp-chapter-title {\n  flex: 1 1 auto;\n  min-width: 0;\n  font-size: 12px;\n  color: var(--nrp-muted);\n  text-align: center;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n}\n.nrp-endline {\n  text-align: center;\n  margin-top: 2.2em;\n  padding-top: 1em;\n  border-top: 1px dashed var(--nrp-border);\n}\n.nrp-btn.nrp-next { font-size: 14px; padding: 8px 18px; }\n.nrp-btn-ghost { cursor: default; }\n\n.nrp-error {\n  padding: 12px;\n  color: #b3261e;\n  font-size: 12px;\n  background: var(--nrp-bg);\n}\n.nrp-note {\n  padding: 18px 14px;\n  font-size: 13px;\n  color: var(--nrp-muted);\n  line-height: 1.6;\n}\n.nrp-link { color: var(--nrp-accent); cursor: pointer; text-decoration: underline; }\n\n.nrp-delivery-head { padding: 12px 14px 4px; text-align: center; flex: none; }\n.nrp-delivery-head .nrp-chapter-h1 { margin-bottom: 0.4em; }\n.nrp-delivery-meta { display: flex; gap: 10px; justify-content: center; align-items: center; font-size: 11px; color: var(--nrp-muted); flex-wrap: wrap; }\n.nrp-tag {\n  border: 1px solid var(--nrp-border);\n  border-radius: 999px;\n  padding: 1px 8px;\n}\n\n.nrp-toast {\n  position: absolute;\n  bottom: 12px;\n  left: 50%;\n  transform: translateX(-50%);\n  background: var(--nrp-card);\n  border: 1px solid var(--nrp-border);\n  border-radius: 999px;\n  font-size: 11px;\n  color: var(--nrp-muted);\n  padding: 3px 12px;\n  pointer-events: none;\n  z-index: 2;\n}\n';

// src/client.js
var CSS_ID = "dsh-reading-pad-css";
if (typeof document !== "undefined" && document.querySelector(`style[data-plugin=${JSON.stringify(CSS_ID)}]`) === null) {
  const tag = document.createElement("style");
  tag.dataset.plugin = CSS_ID;
  tag.textContent = client_default;
  document.head.appendChild(tag);
}
var inject = ["remote", "locale", "slots", "sidebarRightTabs"];
var TAB_SLOT = "sidebar.right.pane.tab";
var TAB_TITLE_SLOT = "sidebar.right.pane.tab.title";
var TAB_ID = "narrative-reading-pad";
var TAB_KIND = "narrative-reading-pad";
var SEEN_KEY = "narrative-reading-pad.seen-revision.v1";
function registerRightbarTabType(ctx, spec) {
  if (typeof ctx.inject !== "function") return;
  ctx.inject(["sidebarRightTabs"], (injected) => {
    const tabs = injected.get("sidebarRightTabs");
    if (tabs === void 0) return;
    ctx.effect(() => tabs.register({
      id: spec.id,
      kind: spec.kind,
      priority: "extension",
      title: spec.title,
      ...spec.guide === void 0 ? {} : { guide: [{ order: spec.guide.order, title: spec.guide.title, description: spec.guide.description }] }
    }), "narrative-reading-pad: right-sidebar tab type");
  });
}
var NS = "narrativeReadingPad";
var zh = {
  title: "\u9605\u8BFB\u677F",
  hint: "\u6C89\u6D78\u5F0F\u53EA\u8BFB\u9605\u8BFB\uFF1AAI \u6295\u9012\u7684\u6587\u7A3F\u4E0E\u4F5C\u54C1\u7AE0\u8282",
  sourceDelivery: "AI \u6295\u9012\u6587\u7A3F",
  sourceChapters: "\u4F5C\u54C1\u7AE0\u8282",
  sourceOutline: "\u5927\u7EB2",
  sourceLore: "lore / \u4EBA\u7269\u5361",
  sourcePad: "\u5199\u5B57\u677F\u8349\u7A3F",
  empty: "\u9605\u8BFB\u677F\u8FD8\u662F\u7A7A\u7684 \u2014\u2014 \u8BA9 AI \u7528 reading_pad_send \u6295\u9012\u4E00\u7BC7\uFF0C\u6216\u5207\u5230\u300C\u4F5C\u54C1\u7AE0\u8282\u300D\u5F00\u59CB\u9605\u8BFB\u3002",
  noChapters: "\u5F53\u524D\u5199\u4F5C\u5DE5\u7A0B\u8FD8\u6CA1\u6709\u7AE0\u8282\u3002",
  noProject: "\u5F53\u524D\u4F1A\u8BDD\u6CA1\u6709\u627E\u5230\u5199\u4F5C\u5DE5\u7A0B\uFF08novel.json\uFF09\u3002",
  loadError: "\u52A0\u8F7D\u5931\u8D25",
  retry: "\u91CD\u8BD5",
  prev: "\u4E0A\u4E00\u7AE0",
  next: "\u4E0B\u4E00\u7AE0",
  nextEnd: "\u5DF2\u662F\u6700\u540E\u4E00\u7AE0",
  theme: "\u4E3B\u9898",
  fontSmall: "A\u207B",
  fontLarge: "A\u207A",
  updatedAt: "\u66F4\u65B0",
  renderError: "\u9605\u8BFB\u677F\u6E32\u67D3\u9519\u8BEF",
  restoreHint: "\u5DF2\u6062\u590D\u4E0A\u6B21\u9605\u8BFB\u4F4D\u7F6E",
  chapterCount: (n) => `\u5171 ${n} \u7AE0`
};
var en = {
  title: "Reading Pad",
  hint: "Immersive read-only reading for delivered prose and chapters",
  sourceDelivery: "AI Delivery",
  sourceChapters: "Manuscript",
  sourceOutline: "Outline",
  sourceLore: "lore / profiles",
  sourcePad: "Writing Pad Draft",
  empty: "Nothing here yet \u2014 ask the AI to deliver text via reading_pad_send, or switch to Manuscript.",
  noChapters: "No chapters in the current writing project.",
  noProject: "No writing project (novel.json) in this session.",
  loadError: "Load failed",
  retry: "Retry",
  prev: "Prev",
  next: "Next",
  nextEnd: "This is the last chapter",
  theme: "Theme",
  fontSmall: "A\u207B",
  fontLarge: "A\u207A",
  updatedAt: "Updated",
  renderError: "Reading pad render error",
  restoreHint: "Restored reading position",
  chapterCount: (n) => `${n} chapter(s)`
};
function strSchema() {
  return {
    parse(v) {
      if (typeof v !== "string") throw new Error("expected string");
      return v;
    }
  };
}
function objSchema() {
  return {
    parse(v) {
      if (v === null || typeof v !== "object" || Array.isArray(v)) throw new Error("expected object");
      return v;
    }
  };
}
function jsonParameter(name) {
  return {
    name,
    wire: name,
    source: "json",
    codec: { mode: "strict", typeSymbol: "typescript#string", create: strSchema }
  };
}
function descriptor(method, parameters, resultSymbol) {
  return {
    id: `narrative-reading-pad#readingPad/${method}`,
    service: "readingPad",
    namespace: "readingPad",
    method,
    invocation: { kind: "direct" },
    parameters,
    result: { mode: "strict", typeSymbol: resultSymbol, create: objSchema }
  };
}
var TYPERT_REMOTE = {
  package: "narrative-reading-pad",
  descriptors: [
    descriptor("saveReading", [jsonParameter("content"), jsonParameter("title"), jsonParameter("source")], "narrative-reading-pad#SaveReadingResult"),
    descriptor("loadReading", [], "narrative-reading-pad#LoadReadingResult")
  ]
};
var PREFS_KEY = "narrative-reading-pad.prefs.v1";
var SCROLL_KEY = "narrative-reading-pad.scroll.v1";
function browserStorage() {
  try {
    return typeof window === "undefined" ? null : window.localStorage;
  } catch {
    return null;
  }
}
function loadPrefs(storage = browserStorage()) {
  try {
    const raw = storage?.getItem(PREFS_KEY);
    if (raw === null || raw === void 0) return null;
    const p = JSON.parse(raw);
    if (p === null || typeof p !== "object") return null;
    return {
      theme: p.theme === "sepia" || p.theme === "night" ? p.theme : "paper",
      fontSize: typeof p.fontSize === "number" && p.fontSize >= 16 && p.fontSize <= 20 ? p.fontSize : 17
    };
  } catch {
    return null;
  }
}
function savePrefs(prefs, storage = browserStorage()) {
  if (storage === null) return;
  try {
    storage.setItem(PREFS_KEY, JSON.stringify(prefs));
  } catch {
  }
}
function loadScroll(storage = browserStorage()) {
  try {
    const raw = storage?.getItem(SCROLL_KEY);
    if (raw === null || raw === void 0) return null;
    const s = JSON.parse(raw);
    if (s === null || typeof s !== "object") return null;
    return { chapterId: typeof s.chapterId === "string" ? s.chapterId : "", ratio: typeof s.ratio === "number" && s.ratio >= 0 && s.ratio <= 1 ? s.ratio : 0 };
  } catch {
    return null;
  }
}
function saveScroll(value, storage = browserStorage()) {
  if (storage === null) return;
  try {
    storage.setItem(SCROLL_KEY, JSON.stringify(value));
  } catch {
  }
}
var padState = { latestRevision: 0, hasNew: false };
function rpc(method, args) {
  const id = typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : "r" + Date.now() + Math.random();
  return fetch("/api/writing/" + method, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ type: "client-request", rpcId: id, method: "writing/" + method, payload: { args: args || {} } })
  }).then((r) => r.json()).then((j) => j && j.result ? j.result : { ok: false, error: { message: "rpc \u54CD\u5E94\u5F02\u5E38" } }).catch((e) => ({ ok: false, error: { message: String(e && e.message || e) } }));
}
var SAFE_URL_RE = /^(https?:\/\/|\/|\.{1,2}\/|#)/i;
function safeUrl(raw) {
  const s = String(raw).trim();
  if (!SAFE_URL_RE.test(s)) return null;
  return s;
}
function escapeHtml(s) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
function renderInline(text) {
  let s = text;
  s = s.replace(/`([^`]+)`/g, (_m, c) => "<code>" + c + "</code>");
  s = s.replace(/!\[([^\]]*)\]\(([^)\s]+)\)/g, (_m, alt, url) => {
    const u = safeUrl(url);
    return u === null ? escapeHtml("![" + alt + "](" + url + ")") : `<img src="${escapeHtml(u)}" alt="${escapeHtml(alt)}">`;
  });
  s = s.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_m, label, url) => {
    const u = safeUrl(url);
    return u === null ? escapeHtml("[" + label + "](" + url + ")") : `<a href="${escapeHtml(u)}">${label}</a>`;
  });
  s = s.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  s = s.replace(/\*([^*]+)\*/g, "<em>$1</em>");
  s = s.replace(/~~([^~]+)~~/g, "<del>$1</del>");
  return s;
}
function renderTable(lines, start, html) {
  const rows = [];
  let i = start;
  let header = null;
  while (i < lines.length && /^\s*\|.*\|\s*$/.test(lines[i]) && lines[i].trim() !== "") {
    rows.push(lines[i]);
    i += 1;
  }
  if (rows.length >= 2 && /^\s*\|?[\s:|-]+\|?$/.test(rows[1].replace(/\|/g, " ")) && rows[1].includes("-")) {
    const cells = (line) => line.trim().replace(/^\||\|$/g, "").split("|").map((c) => c.trim());
    header = cells(rows[0]);
    const body = rows.slice(2).map((r) => cells(r));
    let out = "<table><thead><tr>" + header.map((c) => "<th>" + renderInline(escapeHtml(c)) + "</th>").join("") + "</tr></thead><tbody>";
    for (const r of body) out += "<tr>" + r.map((c) => "<td>" + renderInline(escapeHtml(c)) + "</td>").join("") + "</tr>";
    out += "</tbody></table>";
    html.push(out);
    return i;
  }
  html.push("<p>" + renderInline(escapeHtml(rows[0])) + "</p>");
  if (rows.length > 1) html.push("<p>" + renderInline(escapeHtml(rows[1])) + "</p>");
  if (rows.length > 2) html.push("<p>" + renderInline(escapeHtml(rows[2])) + "</p>");
  return start + Math.min(rows.length, 3);
}
function renderMarkdown(src) {
  const lines = String(src).replace(/\r\n/g, "\n").split("\n");
  const html = [];
  const codeBuf = [];
  const paragraph = [];
  let inCode = false;
  let listTag = null;
  const flushParagraph = () => {
    if (paragraph.length > 0) {
      html.push("<p>" + renderInline(escapeHtml(paragraph.join(" "))) + "</p>");
      paragraph.length = 0;
    }
  };
  const closeList = () => {
    if (listTag !== null) {
      html.push("</" + listTag + ">");
      listTag = null;
    }
  };
  const ensureList = (tag) => {
    if (listTag !== tag) {
      closeList();
      html.push("<" + tag + ">");
      listTag = tag;
    }
  };
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.trim() === "") {
      flushParagraph();
      closeList();
      continue;
    }
    if (line.match(/^```([\w-]*)\s*$/)) {
      flushParagraph();
      closeList();
      if (inCode) {
        html.push("<pre><code>" + escapeHtml(codeBuf.join("\n")) + "</code></pre>");
        codeBuf.length = 0;
        inCode = false;
      } else inCode = true;
      continue;
    }
    if (inCode) {
      codeBuf.push(line);
      continue;
    }
    const heading = line.match(/^(#{1,6})\s+(.*)$/);
    if (heading) {
      flushParagraph();
      closeList();
      const level = heading[1].length;
      html.push(`<h${level}>${renderInline(escapeHtml(heading[2]))}</h${level}>`);
      continue;
    }
    if (/^\s*([-*_])\s*\1\s*\1\s*$/.test(line)) {
      flushParagraph();
      closeList();
      html.push("<hr>");
      continue;
    }
    if (/^>\s?/.test(line)) {
      flushParagraph();
      closeList();
      html.push("<blockquote>" + renderInline(escapeHtml(line.replace(/^>\s?/, ""))) + "</blockquote>");
      continue;
    }
    if (/^\s*\|.*\|\s*$/.test(line)) {
      flushParagraph();
      closeList();
      i = renderTable(lines, i, html) - 1;
      continue;
    }
    const ul = line.match(/^\s*[-*+]\s+(.*)$/);
    if (ul) {
      flushParagraph();
      ensureList("ul");
      html.push("<li>" + renderInline(escapeHtml(ul[1])) + "</li>");
      continue;
    }
    const ol = line.match(/^\s*\d+[.)]\s+(.*)$/);
    if (ol) {
      flushParagraph();
      ensureList("ol");
      html.push("<li>" + renderInline(escapeHtml(ol[1])) + "</li>");
      continue;
    }
    paragraph.push(line);
  }
  if (inCode) html.push("<pre><code>" + escapeHtml(codeBuf.join("\n")) + "</code></pre>");
  flushParagraph();
  closeList();
  return html.join("\n");
}
var ReadingBoundary = class extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null, stack: "" };
  }
  static getDerivedStateFromError(error) {
    return { error, stack: error?.stack ?? String(error) };
  }
  componentDidCatch(error, info) {
    console.error("[narrative-reading-pad]", error, info?.componentStack);
  }
  render() {
    if (this.state.error !== null) {
      return React.createElement(
        "div",
        { className: "nrp-error" },
        React.createElement("div", null, `${zh.renderError}\uFF1A${String(this.state.error?.message ?? this.state.error)}`),
        React.createElement("pre", { style: { whiteSpace: "pre-wrap", fontSize: 11 } }, String(this.state.stack ?? "").slice(0, 800))
      );
    }
    return this.props.children;
  }
};
function ChapterReader({ projectRoot, t }) {
  const [indexData, setIndexData] = React.useState(null);
  const [indexError, setIndexError] = React.useState("");
  const [current, setCurrent] = React.useState(null);
  const [loadError, setLoadError] = React.useState("");
  const scrollRef = React.useRef(null);
  const [restored, setRestored] = React.useState(false);
  const [progress, setProgress] = React.useState(0);
  React.useEffect(() => {
    let alive = true;
    setIndexError("");
    if (typeof projectRoot !== "string" || projectRoot.length === 0) {
      setIndexData({ missing: true });
      return () => {
        alive = false;
      };
    }
    rpc("workspaceIndex", { projectRoot }).then((r) => {
      if (!alive) return;
      if (r && r.ok && r.value) setIndexData(r.value);
      else if (r && r.ok) setIndexData({ missing: true });
      else setIndexError(String(r?.error?.message ?? "workspaceIndex \u5931\u8D25"));
    });
    return () => {
      alive = false;
    };
  }, [projectRoot]);
  const chapters = React.useMemo(() => {
    const list = Array.isArray(indexData?.chapters) ? indexData.chapters : [];
    return list.map((c) => ({ id: c.id, title: c.title || "", words: c.words || 0 }));
  }, [indexData]);
  const currentIndex = React.useMemo(() => {
    if (current === null) return -1;
    return chapters.findIndex((c) => c.id === current.chapter.id);
  }, [current, chapters]);
  React.useEffect(() => {
    if (restored) return;
    if (current === null) return;
    const saved = loadScroll();
    if (saved !== null && saved.chapterId === current.chapter.id) {
      requestAnimationFrame(() => {
        const el = scrollRef.current;
        if (el === null || el === void 0) return;
        el.scrollTop = (el.scrollHeight - el.clientHeight) * Math.min(1, Math.max(0, saved.ratio));
        setRestored(true);
      });
    } else {
      setRestored(true);
    }
  }, [current, restored]);
  const onScroll = React.useCallback(() => {
    const el = scrollRef.current;
    if (el === null || el === void 0 || current === null) return;
    const max = el.scrollHeight - el.clientHeight;
    const ratio = max > 0 ? Math.min(1, Math.max(0, el.scrollTop / max)) : 0;
    setProgress(ratio);
    saveScroll({ chapterId: current.chapter.id, ratio });
  }, [current]);
  function openChapter(index) {
    if (index < 0 || index >= chapters.length) return;
    const c = chapters[index];
    setLoadError("");
    setRestored(false);
    rpc("chapterText", { projectRoot, chapterId: c.id, opts: { cap: 0 } }).then((r) => {
      if (r && r.ok) {
        setCurrent({ chapter: { ...c, title: r.value?.title ?? c.title, words: r.value?.words ?? c.words }, text: String(r.value?.text ?? "") });
      } else {
        setLoadError(String(r?.error?.message ?? "\u7AE0\u8282\u52A0\u8F7D\u5931\u8D25"));
      }
    });
  }
  React.useEffect(() => {
    if (current !== null || chapters.length === 0) return;
    const saved = loadScroll();
    const start = saved !== null ? Math.max(0, chapters.findIndex((c) => c.id === saved.chapterId)) : 0;
    openChapter(start >= 0 ? start : 0);
  }, [chapters]);
  if (indexError !== "") {
    return React.createElement(
      "div",
      { className: "nrp-note" },
      `${zh.loadError}\uFF1A${indexError}`,
      React.createElement("span", { className: "nrp-link", onClick: () => {
        setIndexError("");
        setIndexData(null);
      } }, ` \xB7 ${zh.retry}`)
    );
  }
  if (indexData === null) {
    return React.createElement("div", { className: "nrp-note" }, "\u2026");
  }
  if (indexData && indexData.missing) {
    return React.createElement("div", { className: "nrp-note" }, zh.noProject);
  }
  if (chapters.length === 0) {
    return React.createElement("div", { className: "nrp-note" }, zh.noChapters);
  }
  if (current === null) {
    return React.createElement("div", { className: "nrp-note" }, loadError !== "" ? `${zh.loadError}\uFF1A${loadError}` : "\u2026");
  }
  if (loadError !== "") {
    return React.createElement(
      "div",
      { className: "nrp-note" },
      `${zh.loadError}\uFF1A${loadError}`,
      React.createElement("span", { className: "nrp-link", onClick: () => openChapter(currentIndex) }, ` \xB7 ${zh.retry}`)
    );
  }
  const isFirst = currentIndex <= 0;
  const isLast = currentIndex >= chapters.length - 1;
  const titles = chapters.map((c) => c.title).join(" / ");
  return React.createElement(
    "div",
    { className: "nrp-reader" },
    React.createElement(
      "div",
      { className: "nrp-progress" },
      React.createElement("div", { className: "nrp-progress-bar", style: { width: (progress * 100).toFixed(2) + "%" } })
    ),
    React.createElement(
      "div",
      { className: "nrp-chapter-nav" },
      React.createElement("button", { className: "nrp-btn", disabled: isFirst, onClick: () => openChapter(currentIndex - 1), title: isFirst ? zh.nextEnd : `${zh.prev}\uFF1A${isFirst ? "" : chapters[currentIndex - 1]?.title}` }, zh.prev),
      React.createElement("span", { className: "nrp-chapter-title", title: titles }, `${currentIndex + 1}/${chapters.length} \xB7 ${current.chapter.title}`),
      React.createElement("button", { className: "nrp-btn", disabled: isLast, onClick: () => openChapter(currentIndex + 1), title: isLast ? zh.nextEnd : `${zh.next}\uFF1A${isLast ? "" : chapters[currentIndex + 1]?.title}` }, zh.next)
    ),
    React.createElement(
      "div",
      { ref: scrollRef, className: "nrp-scroll", onScroll },
      React.createElement(
        "article",
        { className: "nrp-content" },
        React.createElement("h1", { className: "nrp-chapter-h1" }, current.chapter.title),
        React.createElement("div", { className: "nrp-prose", dangerouslySetInnerHTML: { __html: renderMarkdown(current.text) } }),
        React.createElement(
          "div",
          { className: "nrp-endline" },
          isLast ? React.createElement("span", { className: "nrp-btn nrp-btn-ghost" }, zh.nextEnd) : React.createElement("button", { className: "nrp-btn nrp-next", onClick: () => openChapter(currentIndex + 1) }, `${zh.next}\uFF1A${chapters[currentIndex + 1]?.title ?? ""}`)
        )
      ),
      restored && loadScroll()?.chapterId === current.chapter.id ? React.createElement("div", { className: "nrp-toast" }, zh.restoreHint) : null
    )
  );
}
function DeliveryReader({ bridge, t }) {
  const [revision, setRevision] = React.useState(-1);
  const [state, setState] = React.useState(null);
  const [error, setError] = React.useState("");
  const [loading, setLoading] = React.useState(true);
  async function poll(force) {
    try {
      const r = await bridge.loadReading();
      if (!r.ok) {
        setError(String(r.error?.message ?? "loadReading \u5931\u8D25"));
        return;
      }
      setError("");
      if (force || r.revision !== revision) {
        setRevision(r.revision);
        setState({ current: r.current ?? null, history: Array.isArray(r.history) ? r.history : [] });
        padState.latestRevision = typeof r.revision === "number" ? r.revision : padState.latestRevision;
      }
    } catch (e) {
      setError(String(e?.message ?? e));
    } finally {
      setLoading(false);
    }
  }
  React.useEffect(() => {
    void poll(true);
    const timer = globalThis.setInterval(() => {
      void poll(false);
    }, 2e3);
    return () => globalThis.clearInterval(timer);
  }, []);
  if (error !== "") {
    return React.createElement(
      "div",
      { className: "nrp-note" },
      `${zh.loadError}\uFF1A${error}`,
      React.createElement("span", { className: "nrp-link", onClick: () => {
        setLoading(true);
        void poll(true);
      } }, ` \xB7 ${zh.retry}`)
    );
  }
  if (loading) return React.createElement("div", { className: "nrp-note" }, "\u2026");
  const current = state?.current ?? null;
  if (current === null) {
    return React.createElement("div", { className: "nrp-note" }, zh.empty);
  }
  const when = current.updatedAt ? new Date(current.updatedAt).toLocaleString() : "";
  return React.createElement(
    "div",
    { className: "nrp-reader" },
    React.createElement(
      "div",
      { className: "nrp-delivery-head" },
      React.createElement("h1", { className: "nrp-chapter-h1" }, current.title || ""),
      React.createElement(
        "div",
        { className: "nrp-delivery-meta" },
        React.createElement("span", { className: "nrp-tag" }, current.source || "ai-delivery"),
        when !== "" ? React.createElement("span", null, `${zh.updatedAt}\uFF1A${when}`) : null
      )
    ),
    React.createElement(
      "div",
      { className: "nrp-scroll nrp-no-progress" },
      React.createElement(
        "article",
        { className: "nrp-content" },
        React.createElement("div", { className: "nrp-prose", dangerouslySetInnerHTML: { __html: renderMarkdown(current.content ?? "") } })
      )
    )
  );
}
function ReadingPanel({ bridge, scope, getCwd, t }) {
  const prefs0 = loadPrefs() ?? { theme: "paper", fontSize: 17 };
  const [source, setSource] = React.useState("delivery");
  const [theme, setTheme] = React.useState(prefs0.theme);
  const [fontSize, setFontSize] = React.useState(prefs0.fontSize);
  const [projectRoot, setProjectRoot] = React.useState(() => {
    const cwd = scope?.cwd;
    return typeof cwd === "string" && cwd.length > 0 ? cwd : "";
  });
  React.useEffect(() => {
    if (typeof projectRoot === "string" && projectRoot.length > 0) return;
    if (typeof getCwd !== "function") return;
    let alive = true;
    getCwd().then((cwd) => {
      if (alive && typeof cwd === "string" && cwd.length > 0) setProjectRoot(cwd);
    }).catch(() => {
    });
    return () => {
      alive = false;
    };
  }, [projectRoot, getCwd]);
  const setPref = (patch) => {
    const next = { theme, fontSize, ...patch };
    setTheme(next.theme);
    setFontSize(next.fontSize);
    savePrefs(next);
  };
  const sources = [
    { key: "delivery", label: t("sourceDelivery"), on: true },
    { key: "chapters", label: t("sourceChapters"), on: true },
    { key: "outline", label: t("sourceOutline"), on: false },
    { key: "lore", label: t("sourceLore"), on: false },
    { key: "pad", label: t("sourcePad"), on: false }
  ];
  return React.createElement(
    "div",
    { className: `nrp-root nrp-theme-${theme}`, style: { "--nrp-font-size": fontSize + "px" } },
    React.createElement(
      "div",
      { className: "nrp-toolbar" },
      React.createElement(
        "div",
        { className: "nrp-sources" },
        sources.map((s) => React.createElement("button", {
          key: s.key,
          className: "nrp-source" + (source === s.key ? " nrp-source-active" : "") + (s.on ? "" : " nrp-source-off"),
          disabled: !s.on,
          onClick: () => setSource(s.key),
          title: s.on ? s.label : `${s.label}\uFF08\u4E8C\u671F\uFF09`
        }, s.label))
      ),
      React.createElement(
        "div",
        { className: "nrp-toolbar-right" },
        React.createElement("button", { className: "nrp-btn", onClick: () => setPref({ fontSize: Math.max(16, fontSize - 1) }), disabled: fontSize <= 16, title: t("fontSmall") }, t("fontSmall")),
        React.createElement("span", { className: "nrp-font-badge" }, `${fontSize}px`),
        React.createElement("button", { className: "nrp-btn", onClick: () => setPref({ fontSize: Math.min(20, fontSize + 1) }), disabled: fontSize >= 20, title: t("fontLarge") }, t("fontLarge")),
        React.createElement(
          "span",
          { className: "nrp-theme-switch" },
          ["paper", "sepia", "night"].map((th) => React.createElement("button", {
            key: th,
            className: "nrp-btn nrp-theme-btn" + (theme === th ? " nrp-theme-btn-active" : ""),
            onClick: () => setPref({ theme: th }),
            title: `${t("theme")}\uFF1A${th}`
          }, th === "paper" ? "\u{1F4C4}" : th === "sepia" ? "\u{1F4DC}" : "\u{1F319}"))
        )
      )
    ),
    React.createElement(
      "div",
      { className: "nrp-body" },
      source === "delivery" ? React.createElement(DeliveryReader, { bridge, t }) : React.createElement(ChapterReader, { projectRoot, t })
    )
  );
}
async function apply(ctx) {
  ctx.effect(() => ctx.locale.register(NS, { zh, en }), "narrative-reading-pad: dictionaries");
  const t = ctx.locale.bind(NS);
  registerRightbarTabType(ctx, {
    id: TAB_ID,
    kind: TAB_KIND,
    title: () => t("title"),
    guide: { order: 30, title: () => t("title"), description: () => t("hint") }
  });
  const getCwd = () => {
    try {
      const c = ctx.get("connection");
      if (c && c.api && c.api.host && c.api.host.describe) {
        return c.api.host.describe({}).then((r) => r && r.value && r.value.cwd ? r.value.cwd : "").catch(() => "");
      }
    } catch {
    }
    return Promise.resolve("");
  };
  const disposeRemote = await ctx.remote.$mount(TYPERT_REMOTE);
  const bridge = await new Promise((resolve, reject) => {
    try {
      ctx.plugin({
        name: "reading-pad-bridge",
        inject: ["remote.readingPad"],
        apply(cctx) {
          const ns = cctx.remote.readingPad;
          const unwrap = (p) => p.then((r) => {
            if (r && r.ok) return r.value;
            throw new Error(r && r.error ? String(r.error.message || r.error) : "readingPad \u8C03\u7528\u5931\u8D25");
          });
          resolve({
            saveReading: (content, title, source) => unwrap(ns.saveReading(content, title, source)),
            loadReading: () => unwrap(ns.loadReading())
          });
        }
      }).then(() => void 0, (error) => reject(error));
    } catch (error) {
      reject(error);
    }
  });
  let disposed = false;
  let tabRegistered = false;
  let tabTimer = null;
  const slotDisposers = [];
  const unseenBadge = () => {
    try {
      const seen = Number(browserStorage()?.getItem(SEEN_KEY) ?? 0);
      return padState.latestRevision > seen ? "\u65B0" : null;
    } catch {
      return null;
    }
  };
  const markSeen = () => {
    try {
      browserStorage()?.setItem(SEEN_KEY, String(padState.latestRevision));
    } catch {
    }
  };
  function TabBody(props) {
    React.useEffect(() => {
      markSeen();
    }, []);
    return React.createElement(
      ReadingBoundary,
      null,
      React.createElement(ReadingPanel, { bridge, scope: props?.scope, getCwd, t })
    );
  }
  function TabTitle() {
    const [badge, setBadge] = React.useState(() => unseenBadge());
    React.useEffect(() => {
      const timer = globalThis.setInterval(() => setBadge(unseenBadge()), 2e3);
      return () => globalThis.clearInterval(timer);
    }, []);
    return React.createElement(
      "span",
      { style: { display: "inline-flex", alignItems: "center", gap: 6 } },
      React.createElement("span", { style: { fontSize: 14 } }, "\u{1F4D6}"),
      t("title"),
      badge === null ? null : React.createElement("span", {
        style: { fontSize: 10, lineHeight: "14px", padding: "0 4px", borderRadius: 6, background: "var(--dsh-accent, #2f7d5d)", color: "#fff" }
      }, badge)
    );
  }
  function registerReadingTab() {
    if (disposed) return true;
    if (typeof ctx.slots?.inject !== "function") return false;
    try {
      slotDisposers.push(ctx.slots.inject(TAB_SLOT, () => ctx.slots.register({
        name: TAB_SLOT,
        key: TAB_ID,
        order: 30,
        locale: NS,
        inject: (sessionId) => ({ sessionId })
      }, TabBody)));
      slotDisposers.push(ctx.slots.inject(TAB_TITLE_SLOT, () => ctx.slots.register({
        name: TAB_TITLE_SLOT,
        key: TAB_ID
      }, TabTitle)));
      tabRegistered = true;
      return true;
    } catch (e) {
      console.error("[narrative-reading-pad] native tab register failed", e);
      return false;
    }
  }
  if (!registerReadingTab()) {
    tabTimer = globalThis.setInterval(() => {
      if (registerReadingTab()) globalThis.clearInterval(tabTimer);
    }, 1e3);
  }
  return () => {
    disposed = true;
    if (tabTimer !== null) globalThis.clearInterval(tabTimer);
    for (const dispose of slotDisposers) {
      try {
        dispose?.();
      } catch {
      }
    }
    slotDisposers.length = 0;
    disposeRemote();
  };
}
return module.exports; } });
