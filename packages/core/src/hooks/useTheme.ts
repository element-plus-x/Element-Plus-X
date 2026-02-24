import type { CSSProperties } from 'vue';
import type { ThemeOverrides } from '../components/ConfigProvider/types';
import {
  DEFAULT_NAMESPACE,
  DEFAULT_THEME
} from '../components/ConfigProvider/constants';
import { useConfigProvider } from '../components/ConfigProvider/hooks';

type ThemeVars = Record<string, string>;

const cssVarPrefix = 'elx';

export function useTheme() {
  const config = useConfigProvider();

  const namespace = computed(() => config.namespace || DEFAULT_NAMESPACE);
  const theme = computed(() => config.theme || DEFAULT_THEME);
  const themeOverrides = computed<ThemeOverrides>(
    () => config.themeOverrides || {}
  );

  const getCommonOverrides = () => themeOverrides.value.common || {};

  const getComponentOverrides = (componentName: string) => {
    return themeOverrides.value.components?.[componentName] || {};
  };

  const toCssVars = (vars: ThemeVars): CSSProperties => {
    const styles: Record<string, string> = {};
    for (const [key, value] of Object.entries(vars)) {
      styles[`--${cssVarPrefix}-${key}`] = value;
    }
    return styles;
  };

  return {
    namespace,
    theme,
    themeOverrides,
    getCommonOverrides,
    getComponentOverrides,
    toCssVars,
    isDark: computed(() => theme.value === 'dark')
  };
}
