<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import mermaid from 'mermaid'
import type { MermaidProps } from '../../types'

const props = withDefaults(
  defineProps<MermaidProps>(),
  {
    codeKey: '',
    lang: '',
    content: '',
    codeData: () => ({}),
    mermaidConfig: () => ({
      delay: 500,
      securityLevel: 'loose',
    }),
  }
)

const loading = ref(true)
const svg = ref('')
const id = useId()

let debounceTimer: ReturnType<typeof setTimeout> | null = null

const renderMermaid = async () => {
  try {
    const valid = await mermaid.parse(props.content)
    if (valid) {
      mermaid.initialize(props.mermaidConfig)
      const { svg: renderedSvg } = await mermaid.render(id, props.content)
      svg.value = renderedSvg
    }
  } catch (err) {
    console.warn('Mermaid parse/render error:', err)
    svg.value = '<pre>Invalid mermaid syntax</pre>'
  }
}

const scheduleRender = () => {
  loading.value = true
  if (debounceTimer) clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => {
    loading.value = false
    renderMermaid()
  }, 300)
}

watch(
  () => props.content,
  () => {
    scheduleRender()
  }
)

onMounted(() => {
  scheduleRender()
})
</script>

<template>
  <div class="markdown-mermaid" element-loading-background="rgba(255, 255, 255, 0.8)" :key="props.codeKey" v-html="svg"
    v-loading="loading"></div>
</template>
<style src="./style.scss"></style>