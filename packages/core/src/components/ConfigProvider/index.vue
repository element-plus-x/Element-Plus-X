<script setup lang="ts">
import type { ConfigProviderProps } from './types';
import { ElConfigProvider } from 'element-plus';
import { resolveElementPlusLocale } from '../../locale/element-plus';
import { provideGlobalConfig } from './hooks';

const props = withDefaults(defineProps<ConfigProviderProps>(), {});

const config = provideGlobalConfig(
  computed(() => ({
    md: props.md,
    mdPlugins: props.mdPlugins,
    locale: props.locale
  }))
);

const elementPlusLocale = computed(() =>
  resolveElementPlusLocale(config.value.locale)
);
</script>

<template>
  <ElConfigProvider :locale="elementPlusLocale">
    <slot />
  </ElConfigProvider>
</template>

<style scoped lang="scss" src="./style.scss"></style>
