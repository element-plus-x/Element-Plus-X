import type { Pluggable } from 'unified';
import rehypeKatex from 'rehype-katex';
import rehypeRaw from 'rehype-raw';
import remarkBreaks from 'remark-breaks';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import { computed, toRefs } from 'vue';
import { rehypeAnimatedPlugin } from '../plugins/rehypePlugin';

function usePlugins(props: any) {
  const {
    allowHtml,
    enableAnimate,
    enableLatex,
    enableBreaks,
    rehypePlugins,
    remarkPlugins,
    rehypePluginsAhead,
    remarkPluginsAhead
  } = toRefs(props);

  const rehype = computed(() => {
    return [
      ...(rehypePluginsAhead.value as Pluggable[]),
      allowHtml.value && rehypeRaw,
      enableLatex.value && rehypeKatex,
      enableAnimate.value && rehypeAnimatedPlugin,
      ...(rehypePlugins.value as Pluggable[])
    ].filter(Boolean) as Pluggable[];
  });

  const remark = computed(() => {
    const base: (Pluggable | { plugins: Pluggable[] })[] = [
      enableLatex.value && remarkMath,
      enableBreaks.value && remarkBreaks
    ].filter(Boolean) as (Pluggable | { plugins: Pluggable[] })[];

    return [
      [remarkGfm, { singleTilde: false }],
      ...(remarkPluginsAhead.value as (Pluggable | { plugins: Pluggable[] })[]),
      ...base,
      ...(remarkPlugins.value as (Pluggable | { plugins: Pluggable[] })[])
    ];
  });

  return {
    rehypePlugins: rehype,
    remarkPlugins: remark
  };
}
export { usePlugins };
