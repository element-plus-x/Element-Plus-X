import type MarkdownIt from 'markdown-it';
import type { Language } from '../../locale/types';

export type MarkdownItPlugin = (md: MarkdownIt) => void;

export interface ConfigProviderProps {
  mdPlugins?: MarkdownItPlugin[];
  md?: MarkdownIt;
  locale?: Language;
  // highlight?: (code: string, language: string) => string;
}
