import type { Root } from 'hast';
import type { Options as TRehypeOptions } from 'mdast-util-to-hast';
import type { PluggableList } from 'unified';
import type { PropType } from 'vue';

import type { CustomAttrs, SanitizeOptions, TVueMarkdown } from './types';
import { computed, defineComponent, ref, shallowRef, toRefs, watch } from 'vue';
import { watchDebounced } from '@vueuse/core';
// import { useMarkdownContext } from '../components/MarkdownProvider';
import { render } from './hast-to-vnode';
import { useMarkdownProcessor } from './useProcessor';

export type { CustomAttrs, SanitizeOptions, TVueMarkdown };

const sharedProps = {
  markdown: {
    type: String as PropType<string>,
    default: ''
  },
  customAttrs: {
    type: Object as PropType<CustomAttrs>,
    default: () => ({})
  },
  remarkPlugins: {
    type: Array as PropType<PluggableList>,
    default: () => []
  },
  rehypePlugins: {
    type: Array as PropType<PluggableList>,
    default: () => []
  },
  rehypeOptions: {
    type: Object as PropType<Omit<TRehypeOptions, 'file'>>,
    default: () => ({})
  },
  sanitize: {
    type: Boolean,
    default: false
  },
  sanitizeOptions: {
    type: Object as PropType<SanitizeOptions>,
    default: () => ({})
  }
};
const vueMarkdownImpl = defineComponent({
  name: 'VueMarkdown',
  props: sharedProps,
  setup(props, { slots, attrs }) {
    const {
      markdown,
      remarkPlugins,
      rehypePlugins,
      rehypeOptions,
      sanitize,
      sanitizeOptions,
      customAttrs
    } = toRefs(props);

    const { processor } = useMarkdownProcessor({
      remarkPlugins,
      rehypePlugins,
      rehypeOptions,
      sanitize,
      sanitizeOptions
    });

    // 防抖优化：控制markdown更新频率，避免流式渲染时频繁触发
    const debouncedMarkdown = ref(markdown.value);
    watchDebounced(
      markdown,
      (val) => {
        debouncedMarkdown.value = val;
      },
      { debounce: 50, maxWait: 200 } // 50ms防抖，最多200ms必须更新一次
    );

    // 缓存优化：使用computed缓存解析结果，避免重复计算
    const hast = computed(() => {
      const mdast = processor.value.parse(debouncedMarkdown.value);
      return processor.value.runSync(mdast) as Root;
    });

    return () => {
      return render(hast.value, attrs, slots, customAttrs.value);
    };
  }
});

const vueMarkdownAsyncImpl = defineComponent({
  name: 'VueMarkdownAsync',
  props: sharedProps,
  async setup(props, { slots, attrs }) {
    const {
      markdown,
      remarkPlugins,
      rehypePlugins,
      rehypeOptions,
      sanitize,
      sanitizeOptions,
      customAttrs
    } = toRefs(props);
    const { processor } = useMarkdownProcessor({
      remarkPlugins,
      rehypePlugins,
      rehypeOptions,
      sanitize,
      sanitizeOptions
    });

    const hast = shallowRef<Root | null>(null);

    // 防抖优化：控制markdown更新频率
    const debouncedMarkdown = ref(markdown.value);

    const process = async (): Promise<void> => {
      const mdast = processor.value.parse(debouncedMarkdown.value);
      hast.value = (await processor.value.run(mdast)) as Root;
    };

    // 使用防抖watch，避免频繁触发异步处理
    watchDebounced(
      markdown,
      (val) => {
        debouncedMarkdown.value = val;
      },
      { debounce: 50, maxWait: 200 }
    );

    watch(() => [debouncedMarkdown.value, processor.value], process, { flush: 'post' });

    await process();

    return () => {
      return hast.value
        ? render(hast.value, attrs, slots, customAttrs.value)
        : null;
    };
  }
});

// export the public type for h/tsx inference
// also to avoid inline import() in generated d.ts files
export const VueMarkdown: TVueMarkdown = vueMarkdownImpl as any;

// export the public type for h/tsx inference
// also to avoid inline import() in generated d.ts files
export const VueMarkdownAsync: TVueMarkdown = vueMarkdownAsyncImpl as any;
