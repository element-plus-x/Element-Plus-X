import type { GlobalShiki } from '@components/XMarkdownCore/hooks/useShiki';
import type { Ref } from 'vue';

import type { MarkdownContext } from './types';
import deepmerge from 'deepmerge';

import { computed, defineComponent, h, inject, provide } from 'vue';
import {
  useDarkModeWatcher,
  usePlugins,
  useProcessMarkdown
} from '../../hooks';
import { GLOBAL_SHIKI_KEY, MARKDOWN_PROVIDER_KEY } from '../../shared';
import { MARKDOWN_CORE_PROPS } from '../../shared/constants';
import { initThemeMode } from '../CodeBlock/shiki-header';
import '../../style/index.scss';

const MarkdownProvider = defineComponent({
  name: 'MarkdownProvider',
  props: MARKDOWN_CORE_PROPS,
  setup(props, { slots, attrs }) {
    const { rehypePlugins, remarkPlugins } = usePlugins(props);
    const { isDark } = useDarkModeWatcher();
    const globalShiki = inject<GlobalShiki>(GLOBAL_SHIKI_KEY);
    const markdown = computed(() => {
      if (props.enableLatex) {
        return useProcessMarkdown(props.markdown);
      } else {
        return props.markdown;
      }
    });
    const processProps = computed(() => {
      return {
        ...props,
        codeXProps: Object.assign(
          {},
          MARKDOWN_CORE_PROPS.codeXProps.default(),
          props.codeXProps
        ),
        markdown: markdown.value
      };
    });
    watch(
      () => props.defaultThemeMode,
      v => {
        if (v) {
          initThemeMode(v);
        }
      },
      { immediate: true }
    );

    const contextProps = computed(() => {
      return deepmerge(
        {
          rehypePlugins: toValue(rehypePlugins),
          remarkPlugins: toValue(remarkPlugins),
          isDark: toValue(isDark),
          globalShiki: toValue(globalShiki)
        },
        processProps.value
      );
    });
    provide(MARKDOWN_PROVIDER_KEY, contextProps);
    return () =>
      h(
        'div',
        { class: 'elx-xmarkdown-provider', ...attrs },
        slots.default && slots.default()
      );
  }
});

function useMarkdownContext(): Ref<MarkdownContext> {
  const context = inject<Ref<MarkdownContext>>(
    MARKDOWN_PROVIDER_KEY,
    computed(() => ({}))
  );
  if (!context) {
    return computed(() => ({})) as unknown as Ref<MarkdownContext>;
  }
  return context;
}
export { MarkdownProvider, useMarkdownContext };
