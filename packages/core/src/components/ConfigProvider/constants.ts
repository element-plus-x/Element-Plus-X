import type { ConfigProviderProps } from './types';

export const APP_CONFIG_PROVIDE_KEY = Symbol('vue-element-plus-x-config');

export const DEFAULT_NAMESPACE = 'elx';

export const DEFAULT_THEME: ConfigProviderProps['theme'] = 'light';

export const DEFAULT_APP_CONFIG: ConfigProviderProps = {
  namespace: DEFAULT_NAMESPACE,
  theme: DEFAULT_THEME,
  themeOverrides: {},
  applyTo: 'root'
};
