import type { CSSProperties, Ref } from 'vue';
import { DEFAULT_NAMESPACE } from '../components/ConfigProvider/constants';
import { useConfigProvider } from '../components/ConfigProvider/hooks';

type CssVarObject = CSSProperties;
type MaybeRef<T> = T | Ref<T>;

const statePrefix = 'is-';
const cssVarPrefix = 'elx';

export function useNamespace(
  block: string,
  namespaceOverrides?: MaybeRef<string | undefined>
) {
  const config = useConfigProvider();

  const namespace = computed(() => {
    return unref(namespaceOverrides) || config.namespace || DEFAULT_NAMESPACE;
  });

  const b = (blockSuffix = '') => {
    return `${namespace.value}-${block}${blockSuffix ? `-${blockSuffix}` : ''}`;
  };

  const e = (element?: string) => {
    return element ? `${b()}__${element}` : '';
  };

  const m = (modifier?: string) => {
    return modifier ? `${b()}--${modifier}` : '';
  };

  const be = (blockSuffix?: string, element?: string) => {
    return blockSuffix && element ? `${b(blockSuffix)}__${element}` : '';
  };

  const bm = (blockSuffix?: string, modifier?: string) => {
    return blockSuffix && modifier ? `${b(blockSuffix)}--${modifier}` : '';
  };

  const em = (element?: string, modifier?: string) => {
    return element && modifier ? `${e(element)}--${modifier}` : '';
  };

  const bem = (blockSuffix?: string, element?: string, modifier?: string) => {
    return blockSuffix && element && modifier
      ? `${be(blockSuffix, element)}--${modifier}`
      : '';
  };

  const is = (name: string, state: boolean = true) => {
    return name && state ? `${statePrefix}${name}` : '';
  };

  const cssVar = (vars: Record<string, string | undefined>): CssVarObject => {
    const styles: Record<string, string> = {};
    for (const [key, value] of Object.entries(vars)) {
      if (value === undefined) {
        continue;
      }
      styles[`--${cssVarPrefix}-${key}`] = value;
    }
    return styles;
  };

  const cssVarBlock = (
    vars: Record<string, string | undefined>
  ): CssVarObject => {
    const styles: Record<string, string> = {};
    for (const [key, value] of Object.entries(vars)) {
      if (value === undefined) {
        continue;
      }
      styles[`--${cssVarPrefix}-${block}-${key}`] = value;
    }
    return styles;
  };

  return {
    namespace,
    b,
    e,
    m,
    be,
    bm,
    em,
    bem,
    is,
    cssVar,
    cssVarBlock
  };
}
