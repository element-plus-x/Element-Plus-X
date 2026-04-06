import type { Language as ElementPlusLanguage } from 'element-plus/es/locale';
import type { Language } from './types';
import epEn from 'element-plus/es/locale/lang/en';
import epZhCn from 'element-plus/es/locale/lang/zh-cn';

const ELEMENT_PLUS_LOCALE_MAP: Record<string, ElementPlusLanguage> = {
  en: epEn,
  'zh-cn': epZhCn
};

export function resolveElementPlusLocale(
  locale?: Language
): ElementPlusLanguage {
  const localeName = locale?.name?.toLowerCase();

  if (!localeName) return epZhCn;

  return ELEMENT_PLUS_LOCALE_MAP[localeName] ?? epZhCn;
}
