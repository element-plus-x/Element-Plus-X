<script setup lang="ts">
import { h } from 'vue'
import type { ComputedRef } from 'vue'
import type { TypewriterInstance, TypewriterProps, TypingConfig } from './types.d.ts'
import DOMPurify from 'dompurify' // 新增安全过滤
import MarkdownIt from 'markdown-it'
import { parseDocument } from 'htmlparser2'
// import Prism from 'prismjs'
import { usePrism } from '../../hooks/usePrism'

import { useAppConfig } from '../AppConfig/hooks.ts'

const props = withDefaults(defineProps<TypewriterProps>(), {
  content: '',
  isMarkdown: false,
  typing: false,
  isFog: false,
})

const emits = defineEmits<{
  /** 开始打字时触发 */
  start: [instance: TypewriterInstance]
  /** 打字过程中触发（携带进度百分比） */
  writing: [instance: TypewriterInstance]
  /** 打字结束时触发 */
  finish: [instance: TypewriterInstance]
}>()

const appConfig = useAppConfig()

const highlight = computed(() => {
  if (!props.highlight) {
    return appConfig.highlight ?? usePrism()
  }
  return props.highlight
})

const markdownContentRef = ref<HTMLElement | null>(null)
const typeWriterRef = ref<HTMLElement | null>(null)

onMounted(() => {
  // 初始化雾化背景色
  updateFogColor()

  // nextTick(() => {
  //   Prism.highlightAll()
  // })
})

const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
  breaks: true,
  highlight: (code, lang) => {
    // const grammar = Prism.languages[lang]
    // if (grammar) {
    //   // // 调用 Prism 高亮代码
    //   // const highlightedCode = Prism.highlight(code, grammar || Prism.languages.text, lang)

    //   // // 生成带 Prism 样式的 HTML
    //   // return `<pre class="language-${lang}"><code class="language-${lang}">${highlightedCode}</code></pre>`
    //   return Prism.highlight(code, grammar, lang)
    // }
    // return code
    return highlight.value?.(code, lang)
  },
})

function initMarkdownPlugins() {
  if (appConfig.mdPlugins?.length) {
    appConfig.mdPlugins.forEach((plugin) => {
      md.use(plugin)
    })
  }
  if (props.mdPlugins?.length) {
    props.mdPlugins.forEach((plugin) => {
      md.use(plugin)
    })
  }
}

initMarkdownPlugins()

const typingIndex = ref(0)
const isTyping = ref(false)
let timer: ReturnType<typeof setTimeout> | null = null
const contentCache = ref('') // 添加缓存变量

// 配置合并逻辑修改
const mergedConfig: ComputedRef<TypingConfig> = computed(() => {
  const defaultConfig: TypingConfig = {
    step: typeof props.typing === 'object' ? props.typing.step ?? 2 : 2,
    interval: typeof props.typing === 'object' ? props.typing.interval ?? 50 : 50,
    // 根据条件动态设置后缀
    suffix: props.isMarkdown ? '' : typeof props.typing === 'object' ? props.typing.suffix ?? '|' : '|',
  }

  // 处理打字配置
  if (props.typing === true) {
    return {
      ...defaultConfig,
    }
  }

  if (typeof props.typing === 'object') {
    return {
      ...defaultConfig,
      ...props.typing,
      // 强制覆盖后缀设置
      suffix: props.isMarkdown ? '' : props.typing.suffix ?? '|',
    }
  }

  return defaultConfig
})

// 修改内容处理逻辑
const processedContent = computed(() => {
  if (!props.content)
    return ''

  // 非打字模式直接渲染完整内容
  if (!props.typing) {
    return props.content
  }

  // 打字模式处理截断内容
  const displayed = contentCache.value.slice(0, typingIndex.value)
  return displayed
})

// 计算属性
const typingProgress = computed(() => {
  return contentCache.value
    ? Math.min((typingIndex.value / contentCache.value.length) * 100, 100)
    : 0
})

// 修改渲染内容计算属性
const renderedContent = computed(() => {
  // 非Markdown模式直接返回
  if (!props.isMarkdown) {
    return processedContent.value
  }
  // Markdown模式添加安全过滤和样式类,并处理成dom ast
  return parseDocument(DOMPurify.sanitize(
    md.render(processedContent.value)
  )).children
})

const instance: TypewriterInstance = {
  interrupt,
  continue: continueTyping,
  restart,
  destroy,
  renderedContent: computed(() => renderedContent.value),
  isTyping: toRef(isTyping),
  progress: computed(() => typingProgress.value),
}

const MarkdownNodeRenderer = defineComponent({
  name: 'MarkdownNodeRenderer',
  props: {
    node: {
      type: Object,
      required: true,
    },
  },
  setup(props) {
    return () => {
      const { node } = props;
      if (node.type === 'text') {
        return node.data
      } else {
        return h(
          node.tagName,
          { ...node.attribs },
          node.children.map((child: any, index: number) =>
            h(MarkdownNodeRenderer, { node: child, key: index })
          )
        )
      }
    }
  },
})

// 打字逻辑
watch(
  () => props.content,
  (newVal, oldVal) => {
    if (!props.typing) {
      typingIndex.value = newVal?.length || 0
      isTyping.value = false
      contentCache.value = newVal || ''
      return
    }

    const shouldReset = !oldVal || !newVal?.startsWith(oldVal)

    if (shouldReset) {
      typingIndex.value = 0
      contentCache.value = newVal || ''
    }
    else {
      contentCache.value = newVal || ''
    }

    if (!isTyping.value) {
      startTyping()
    }
  },
  { immediate: true },
)

function startTyping() {
  clearTimeout(timer!)
  if (!props.typing || !contentCache.value)
    return

  isTyping.value = true
  emits('start', instance)

  const typeNext = () => {
    typingIndex.value += mergedConfig.value.step!
    emits('writing', instance)

    if (typingIndex.value >= contentCache.value.length) {
      finishTyping()
      return
    }

    timer = setTimeout(typeNext, mergedConfig.value.interval)
  }

  timer = setTimeout(typeNext, mergedConfig.value.interval)
}

function finishTyping() {
  isTyping.value = false
  typingIndex.value = contentCache.value.length
  emits('finish', instance)
}

// 公共方法
function interrupt() {
  clearTimeout(timer!)
  isTyping.value = false
}

function continueTyping() {
  if (typingIndex.value < contentCache.value.length) {
    startTyping()
  }
}

function restart() {
  typingIndex.value = 0
  startTyping()
}

function destroy() {
  clearTimeout(timer!)
  timer = null
  typingIndex.value = 0
  isTyping.value = false
}

// 辅助函数：获取元素背景色并检查是否透明
function getBackgroundColor(element: HTMLElement | null) {
  if (!element)
    return null
  const color = getComputedStyle(element).backgroundColor
  const isTransparent = color === 'rgba(0, 0, 0, 0)' || color === 'transparent' || color === 'initial'
  return isTransparent ? null : color
}

// 雾化颜色跟随背景色
function updateFogColor() {
  if (markdownContentRef.value) {
    let bgColor = getBackgroundColor(markdownContentRef.value)
    if (!bgColor) {
      bgColor = getBackgroundColor(typeWriterRef.value)
      if (!bgColor) {
        const bubbleContent = document.querySelector('.el-bubble-content') as HTMLElement | null
        bgColor = getBackgroundColor(bubbleContent)
        if (!bgColor) {
          const bubble = document.querySelector('.el-bubble') as HTMLElement | null
          bgColor = getBackgroundColor(bubble)
        }
      }
    }
    if (bgColor) {
      markdownContentRef.value.style.setProperty('--el-fill-color', bgColor)
    }
  }
}

// 生命周期
onUnmounted(destroy)

// 暴露方法
defineExpose(instance)
</script>

<template>
  <div ref="typeWriterRef" class="typer-container">
    <div
      ref="markdownContentRef" class="typer-content"
      :class="[
        {
          'markdown-content': isMarkdown,
          'typing-cursor': typing && mergedConfig.suffix && isTyping,
          'typing-cursor-foggy': props.isFog && typing && mergedConfig.suffix && isTyping,
          'typing-markdown-cursor-foggy': isMarkdown && props.isFog && typing && isTyping,
        },
        isMarkdown ? 'markdown-body' : '',
      ]"
      :style="{
        '--cursor-char': `'${mergedConfig.suffix}'`,
        '--cursor-fog-bg-color': props.isFog ? (typeof props.isFog === 'object' ? props.isFog.bgColor ?? 'var(--el-fill-color)' : 'var(--el-fill-color)') : '',
        '--cursor-fog-width': props.isFog ? (typeof props.isFog === 'object' ? props.isFog.width ?? '80px' : '80px') : '',
      }">
        <template v-if="isMarkdown">
          <MarkdownNodeRenderer v-for="(node, index) in renderedContent" :key="index" :node="node" />
        </template>
      <div v-else v-html="renderedContent"></div>
    </div>
  </div>
</template>

<!-- 样式转移-暂定方案-为后续主题做准备 -->
<style scoped lang="scss" src="./style.scss"></style>
