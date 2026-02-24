<script setup lang="ts">
import type { ConfigProviderProps } from './types';
import { APP_CONFIG_PROVIDE_KEY, DEFAULT_APP_CONFIG } from './constants';

const props = withDefaults(defineProps<ConfigProviderProps>(), {});
const parentConfig = inject<ConfigProviderProps>(
  APP_CONFIG_PROVIDE_KEY,
  DEFAULT_APP_CONFIG
);

const config = reactive<ConfigProviderProps>({
  namespace: parentConfig.namespace,
  theme: parentConfig.theme,
  themeOverrides: parentConfig.themeOverrides,
  applyTo: parentConfig.applyTo
});

watchEffect(() => {
  config.namespace = props.namespace ?? parentConfig.namespace;
  config.theme = props.theme ?? parentConfig.theme;
  config.themeOverrides = props.themeOverrides ?? parentConfig.themeOverrides;
  config.applyTo = props.applyTo ?? parentConfig.applyTo;
});

watchEffect(() => {
  if (typeof document === 'undefined') {
    return;
  }
  if (config.applyTo !== 'root') {
    return;
  }
  document.documentElement.classList.toggle('dark', config.theme === 'dark');
});

function buildThemeVars(themeOverrides: ConfigProviderProps['themeOverrides']) {
  const nextVars: Record<string, string> = {};
  const common = themeOverrides?.common || {};
  for (const [key, value] of Object.entries(common)) {
    nextVars[`--elx-${key}`] = String(value);
  }
  const components = themeOverrides?.components || {};
  for (const overrides of Object.values(components)) {
    for (const [key, value] of Object.entries(overrides || {})) {
      nextVars[`--elx-${key}`] = String(value);
    }
  }
  return nextVars;
}

const scopeStyle = computed(() => buildThemeVars(config.themeOverrides));
const prevScopeStyle = ref<Record<string, string>>({});

watchEffect(() => {
  if (typeof document === 'undefined') {
    return;
  }
  if (config.applyTo !== 'root') {
    return;
  }
  const root = document.documentElement;
  const nextVars = scopeStyle.value;
  const prevVars = prevScopeStyle.value;

  for (const [key, prevValue] of Object.entries(prevVars)) {
    if (!(key in nextVars)) {
      if (root.style.getPropertyValue(key).trim() === prevValue) {
        root.style.removeProperty(key);
      }
    }
  }

  for (const [key, value] of Object.entries(nextVars)) {
    root.style.setProperty(key, value);
  }
  prevScopeStyle.value = nextVars;
});

provide<ConfigProviderProps>(APP_CONFIG_PROVIDE_KEY, config);
</script>

<template>
  <div
    v-if="config.applyTo === 'self'"
    :style="scopeStyle"
    style="display: contents"
  >
    <slot />
  </div>
  <slot v-else />
</template>

<style scoped lang="scss" src="./style.scss"></style>
