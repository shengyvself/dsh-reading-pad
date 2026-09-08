# Security Policy

## Trust boundary

- **AI-delivered content is rendered as data, never executed.** The client renders Markdown with a strict front-end subset: all HTML is escaped, and links/images are restricted to `http/https`, root-relative, or relative URLs (dangerous schemes are dropped).
- **The server persists one state file** at `~/.dsh/dsh-reading-pad-state.json` (current piece + up to 20 history entries, FIFO). It contains only text the model delivered; it never touches writing-project files.
- **No outbound network requests** are made by this plugin; there are no external dependencies beyond the DSH host packages declared in `peerDependencies`.

## Reporting a vulnerability

Please do not open a public issue for security problems. Report privately via GitHub's private vulnerability reporting (Security tab → Report a vulnerability), or by opening a draft Security Advisory.

We aim to acknowledge reports within 3 business days.

## Supported versions

Security fixes land on the latest release. Older versions are not separately maintained.
