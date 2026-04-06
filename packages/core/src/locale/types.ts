export interface ThinkingLocale {
  start: string;
  thinking: string;
  end: string;
  error: string;
  cancel: string;
  errorContent: string;
}

export interface LanguageConfig {
  thinking: ThinkingLocale;
}

export interface Language {
  name: string;
  elpx: LanguageConfig;
}

export interface TranslateOption {
  [key: string]: string | number | undefined;
}
