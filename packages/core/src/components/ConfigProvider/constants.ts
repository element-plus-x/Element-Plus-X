import type { Options } from 'markdown-it';
import type { ComputedRef, InjectionKey } from 'vue';
import type { ConfigProviderProps } from './types';
import MarkdownIt from 'markdown-it';
import zhCn from '../../locale/lang/zh-cn';

export const APP_CONFIG_PROVIDE_KEY: InjectionKey<
  ComputedRef<ConfigProviderProps>
> = Symbol('vue-element-plus-x-config');

export const DEFAULT_MD_CONFIG: Options = {
  html: true,
  linkify: true,
  typographer: true,
  breaks: true
};

export const DEFAULT_APP_CONFIG: ConfigProviderProps = {
  mdPlugins: [],
  md: new MarkdownIt(DEFAULT_MD_CONFIG),
  locale: zhCn
};
