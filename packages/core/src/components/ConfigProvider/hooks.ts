import type { App, MaybeRef } from 'vue';
import type { ConfigProviderProps } from './types';
import { computed, getCurrentInstance, inject, provide, ref, unref } from 'vue';
import { APP_CONFIG_PROVIDE_KEY, DEFAULT_APP_CONFIG } from './constants';

const globalConfig = ref<ConfigProviderProps>(DEFAULT_APP_CONFIG);

function mergeConfig(
  baseConfig: ConfigProviderProps,
  overrideConfig?: Partial<ConfigProviderProps>
): ConfigProviderProps {
  return {
    md: overrideConfig?.md ?? baseConfig.md ?? DEFAULT_APP_CONFIG.md,
    mdPlugins:
      overrideConfig?.mdPlugins ??
      baseConfig.mdPlugins ??
      DEFAULT_APP_CONFIG.mdPlugins,
    locale:
      overrideConfig?.locale ?? baseConfig.locale ?? DEFAULT_APP_CONFIG.locale
  };
}

export function buildConfigProviderContext(
  parentConfig: MaybeRef<ConfigProviderProps | undefined>,
  currentConfig: MaybeRef<Partial<ConfigProviderProps> | undefined>
) {
  return computed(() => {
    const resolvedParent = mergeConfig(DEFAULT_APP_CONFIG, unref(parentConfig));
    return mergeConfig(resolvedParent, unref(currentConfig));
  });
}

export function useConfigProvider() {
  const fallbackConfig = computed(() => globalConfig.value);
  const injectedConfig = getCurrentInstance()
    ? inject(APP_CONFIG_PROVIDE_KEY, fallbackConfig)
    : fallbackConfig;

  return computed(() => mergeConfig(DEFAULT_APP_CONFIG, unref(injectedConfig)));
}

export function provideGlobalConfig(
  config: MaybeRef<Partial<ConfigProviderProps> | undefined>,
  app?: App
) {
  const inSetup = !!getCurrentInstance();
  const parentConfig = inSetup
    ? useConfigProvider()
    : computed(() => globalConfig.value);
  const context = buildConfigProviderContext(parentConfig, config);
  const provideFn = app?.provide ?? (inSetup ? provide : undefined);

  provideFn?.(APP_CONFIG_PROVIDE_KEY, context);

  if (app || !inSetup) {
    globalConfig.value = context.value;
  }

  return context;
}
