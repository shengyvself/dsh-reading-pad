// 构建 dsh-reading-pad：服务端 ESM 原样复制；客户端 esbuild 打浏览器 CJS + ModuleLoader 包装（roundtable 同构）。
import { rm, cp, mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { build } from 'esbuild';

const root = fileURLToPath(new URL('..', import.meta.url));
await rm(new URL('../lib', import.meta.url), { recursive: true, force: true });
await mkdir(new URL('../lib', import.meta.url), { recursive: true });
await cp(new URL('../src/index.js', import.meta.url), new URL('../lib/index.js', import.meta.url));

const clientId = 'dsh-reading-pad';
await build({
  entryPoints: [fileURLToPath(new URL('../src/client.js', import.meta.url))],
  outdir: fileURLToPath(new URL('../lib', import.meta.url)),
  bundle: true,
  platform: 'browser',
  target: 'es2022',
  format: 'cjs',
  jsx: 'automatic',
  sourcemap: false,
  loader: { '.css': 'text' },
  external: [
    'react',
    'react/jsx-runtime',
    '@deepseek-ai/cordis',
    '@deepseek-ai/dsh-client-locale/client',
    '@deepseek-ai/dsh-client-ui-slots'
  ],
  banner: { js: `window.__ModuleLoader__.load({ id: ${JSON.stringify(clientId)}, factory: (require) => { var module = { exports: {} }; var exports = module.exports;` },
  footer: { js: 'return module.exports; } });' }
});
console.log('built dsh-reading-pad');
