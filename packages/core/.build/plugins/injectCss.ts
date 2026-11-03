import type { Plugin } from 'vite';
import path from 'node:path';
import MagicString from 'magic-string';

// vite-plugin-lib-inject-css 在 rolldown (vite 8) 下已失效（ast-grep 解析产物
// 异常），这里用同等的 post generateBundle 逻辑自行注入 css import
export function injectCss(): Plugin {
  return {
    name: 'vite:inject-css',
    apply: 'build',
    enforce: 'post',
    generateBundle({ format }, bundle) {
      if (format !== 'es') return;
      for (const chunk of Object.values(bundle)) {
        if (chunk.type !== 'chunk') continue;
        const importedCss = chunk.viteMetadata?.importedCss;
        if (!importedCss?.size) continue;
        const injections = [...importedCss]
          .map(cssFileName => {
            let rel = path
              .relative(path.dirname(chunk.fileName), cssFileName)
              .replaceAll(/[\\/]+/g, '/');
            rel = rel.startsWith('.') ? rel : `./${rel}`;
            return `import '${rel}';`;
          })
          .join('');
        chunk.code = injections + chunk.code;
        if (chunk.map) {
          chunk.map = new MagicString(chunk.code).generateMap({
            hires: 'boundary'
          }) as unknown as typeof chunk.map;
        }
      }
    }
  };
}
