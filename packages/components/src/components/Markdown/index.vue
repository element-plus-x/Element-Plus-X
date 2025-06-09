<script lang="ts">
import { defineComponent, h } from 'vue'
import { VueMarkdown } from '@crazydos/vue-markdown'
import rehypeKatex from 'rehype-katex'
import rehypeRaw from 'rehype-raw'
import Code from './components/Code/index.vue'
import Mermaid from './components/Mermaid/index.vue'
export default defineComponent({
  props: {
    markdown: { type: String, required: true },
    codeBlockRenderers: {
      type: Object,
      default: () => ({}),
    },
    allowHTML: {
      type: Boolean,
      default: true,
    },
    enableLatex: {
      type: Boolean,
      default: true,
    },
  },
  setup(props, { attrs, slots }) {
    const defaultRehypePlugins = computed(() => [
      props.allowHTML && rehypeRaw,
      props.enableLatex && rehypeKatex,
    ]).value.filter(Boolean) as any[]
    const mergedRehypePlugins = [
      ...defaultRehypePlugins,
      ...(Array.isArray(attrs.rehypePlugins) ? attrs.rehypePlugins : []),
    ]

    function renderCode(codeData: any) {
      if(props.codeBlockRenderers && props.codeBlockRenderers[codeData.language]) {
        const rederer = props.codeBlockRenderers[codeData.language]
        if (typeof rederer === 'function') {
          return rederer({
            codeKey: codeData.key,
            lang: codeData.language,
            content: codeData.content,
            codeData,
          })
        }
        return h(rederer, {
          codeKey: codeData.key,
          lang: codeData.language,
          content: codeData.content,
          codeData,
        })
      }else{
        if (codeData.language === 'mermaid') {
          return h(Mermaid, {
            codeKey: codeData.key,
            lang: codeData.language,
            content: codeData.content,
            codeData,
          })
        }
        return h(
          Code,
          {
            codeKey: codeData.key,
            codeData,
          }
        )
      }
    }
    return () =>
      h(VueMarkdown, {
        class: 'markdown-body',
        ...attrs,
        rehypePlugins: mergedRehypePlugins,
        markdown: props.markdown
      }, {
        ...slots,
        code: renderCode
      })
  },
})

</script>
