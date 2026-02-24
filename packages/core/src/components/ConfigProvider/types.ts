export interface ThemeOverrides {
  common?: Record<string, string>;
  components?: Record<string, Record<string, string>>;
}

export interface ConfigProviderProps {
  namespace?: string;
  theme?: 'light' | 'dark';
  themeOverrides?: ThemeOverrides;
  applyTo?: 'root' | 'self';
}
