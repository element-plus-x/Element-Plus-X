import { extname, join, relative } from 'node:path';
import process from 'node:process';
import { defineConfig } from '@rspack/cli';
import fg from 'fast-glob';
import plugins from './.rspack/plugins/index.ts';

const root = process.cwd();

const entries = fg.globSync('src/components/*/*.(tsx|ts|vue)', {
  ignore: ['src/components/**/*.d.ts', 'src/components/**/*.types.ts']
});

const hooksEntries = fg.globSync('src/hooks/*.(ts|tsx)', {
  ignore: ['src/hooks/**/*.d.ts', 'src/hooks/**/*.types.ts']
});

const entriesObj = Object.fromEntries(
  entries.map(f => {
    return [
      relative('src/components', f.slice(0, f.length - extname(f).length)),
      join(root, f)
    ];
  })
);

const hooksEntriesObj = Object.fromEntries(
  hooksEntries.map(f => {
    return [
      `hooks/${relative('src/hooks', f.slice(0, f.length - extname(f).length))}`,
      join(root, f)
    ];
  })
);

const rules = [
  {
    test: /\.vue$/,
    loader: 'vue-loader',
    options: {
      experimentalInlineMatchResource: true
    }
  },
  {
    test: /\.ts$/,
    loader: 'builtin:swc-loader',
    options: {
      jsc: {
        parser: {
          syntax: 'typescript'
        }
      }
    },
    type: 'javascript/auto'
  },
  {
    test: /\.css$/,
    use: ['vue-style-loader', 'css-loader']
  },
  {
    test: /\.s[ac]ss$/,
    use: ['vue-style-loader', 'css-loader', 'sass-loader']
  }
];

const resolve = {
  extensions: ['.ts', '.tsx', '.js', '.jsx', '.vue', '.json'],
  alias: {
    '@': join(root, 'src'),
    '@components': join(root, 'src/components'),
    '@hooks': join(root, 'src/hooks')
  }
};
export default defineConfig([
  {
    entry: {
      index: join(root, 'src/index.ts'),
      components: join(root, 'src/components.ts'),
      ...entriesObj,
      ...hooksEntriesObj
    },
    plugins,
    resolve,
    module: {
      rules
    },
    output: {
      clean: true,
      chunkFormat: 'module',
      filename: '[name].mjs',
      path: join(root, 'dist/es'),
      module: true
    }
  },
  {
    entry: join(root, 'src/index.ts'),
    plugins,
    resolve,
    module: {
      rules
    },
    output: {
      clean: true,
      filename: '[name].js',
      path: join(root, 'dist/umd'),
      library: {
        type: 'umd',
        name: 'ElementPlusX',
        export: 'default',
        umdNamedDefine: true
      }
    }
  }
]);
