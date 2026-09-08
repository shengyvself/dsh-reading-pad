# Architecture

`dsh-reading-pad` is a DeepSeek Harness (DSH) plugin with a server part and a browser client, joined by a Typert remote. It renders **only** — text organization and layout are the model's job before delivery.

## Data flow (AI delivery source)

```
model ── reading_pad_send ──▶ ReadingPadService.saveReading(content, title?, source?)
                                   │  structural validation only, no text rewriting
                                   ▼
                        ~/.dsh/dsh-reading-pad-state.json
                        (current + history ≤ 20, FIFO)
                                   ▲
client (tab) ── loadReading() (2s poll, revision-dedup) ──┘
```

- The server (`src/index.js`) exposes remote methods `saveReading` / `loadReading` via `ctx.remote.readingPad` and registers the model tool `reading_pad_send` (returns a short `{ok, error, revision}` confirmation, never echoes full text).
- State is a single JSON file under DSH home. Corrupt/missing files degrade silently to the empty state.

## Data flow (manuscript source, read-only)

The tab browses chapters of the current writing project through the writing workspace's HTTP RPC (`/api/writing/workspaceIndex`, `/api/writing/chapterText`). This source requires the writing architecture to be installed; without it the panel shows an empty state while the AI-delivery source keeps working.

## Client

- `src/client.js` registers a better-sidebar tab (`dsh-reading-pad`, 📖, single, order 30) with a 1s polling fallback for host readiness and idempotent re-registration.
- Rendering: pure front-end M1 Markdown subset (headings, emphasis, inline code, links/images, single-level lists, blockquote, hr, fenced code, GFM tables). All HTML is escaped; URLs are whitelisted to `http/https`, root-relative or relative paths.
- Preferences (theme, font size) and scroll position are persisted to `localStorage`; `prefers-reduced-motion` disables smooth scrolling.
- Built with esbuild into a browser CJS bundle wrapped in `__ModuleLoader__` (roundtable-style isomorphic packaging).

## Build

`node scripts/build.mjs` copies `src/index.js` → `lib/index.js` and bundles `src/client.js` (+ inline CSS) → `lib/client.js`.

## Packaging

- `package.json` declares `dsh.bundle.patch: ./cordis.patch.yml` (tab registration).
- All `@deepseek-ai/*` packages and `react` stay in `peerDependencies` — DSH hosts provide them; duplicating them in `dependencies` would shadow the host versions.
