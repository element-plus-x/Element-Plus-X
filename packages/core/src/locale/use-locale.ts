import type { Language, TranslateOption } from './types';
import { computed, unref } from 'vue';
import { useConfigProvider } from '../components/ConfigProvider/hooks';
import zhCn from './lang/zh-cn';

function getLocaleValue(locale: Language, path: string) {
  return path.split('.').reduce<unknown>((currentValue, segment) => {
    if (
      currentValue &&
      typeof currentValue === 'object' &&
      segment in currentValue
    ) {
      return (currentValue as Record<string, unknown>)[segment];
    }

    return undefined;
  }, locale);
}

export function translate(
  path: string,
  option: TranslateOption | undefined,
  locale: Language
) {
  const value = getLocaleValue(locale, path);
  const message = typeof value === 'string' ? value : path;

  return message.replace(/\{(\w+)\}/g, (_, key: string) => {
    const replaced = option?.[key];
    return `${replaced ?? `{${key}}`}`;
  });
}

export function buildTranslator(locale: () => Language) {
  return (path: string, option?: TranslateOption) =>
    translate(path, option, locale());
}

export function useLocale(localeOverrides?: () => Language | undefined) {
  const configProvider = useConfigProvider();
  const locale = computed(
    () => localeOverrides?.() ?? configProvider.value.locale ?? zhCn
  );

  return {
    lang: computed(() => unref(locale).name),
    locale,
    t: buildTranslator(() => unref(locale))
  };
}
