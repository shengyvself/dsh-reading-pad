# Contributing

Thanks for considering a contribution to `dsh-reading-pad`.

## Project shape

- `src/index.js` — server side: `ReadingPadService` (Typert remote `readingPad`, `saveReading`/`loadReading`) and the `reading_pad_send` tool definition.
- `src/client.js` / `src/client.css` — browser side: the better-sidebar tab, themes, typography, and the M1 Markdown renderer.
- `scripts/build.mjs` — copies the server entry and bundles the client with esbuild into `lib/` (`__ModuleLoader__` wrapper).
- `cordis.patch.yml` — the `dsh.bundle` patch registering the tab.
- `lib/` is build output; regenerate it with the build script and commit it together with source changes.

## Local development

```bash
npm ci            # installs esbuild only
npm run build     # rebuild lib/
```

The plugin runs inside a DeepSeek Harness (DSH) web profile with a `dsh-better-sidebar` host; all `@deepseek-ai/*` packages and `react` are provided by the host (`peerDependencies`) and must not be added to `dependencies`.

## Before a pull request

- `npm run build` passes and `lib/` is up to date.
- `package.json` keeps `dsh.bundle` declared.
- No new runtime dependencies beyond the DSH host packages; the M1 renderer stays dependency-free by design.
- Keep the read-only contract: the plugin writes only its own state file and never modifies writing-project files.

## License

By contributing you agree that your contributions are licensed under Apache-2.0 (see `LICENSE`).
