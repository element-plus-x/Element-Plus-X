<script setup lang="ts">
import type { ComputedRef } from 'vue'
import type { TypewriterInstance, TypewriterProps, TypingConfig } from './types.d.ts'
import DOMPurify from 'dompurify' // 新增安全过滤
import MarkdownIt from 'markdown-it'
// 在组件中初始化时
import Prism from 'prismjs'
// import 'github-markdown-css'
import 'prismjs/themes/prism.css'

// markdown主题
document.querySelector('html')?.className.includes('dark')
  ? import('github-markdown-css/github-markdown-dark.css')
  : import('github-markdown-css/github-markdown-light.css')

const props = withDefaults(defineProps<TypewriterProps>(), {
  isMarkdown: false,
  typing: false,
})
const emit = defineEmits<{
  /** 开始打字时触发 */
  start: [instance: TypewriterInstance]
  /** 打字过程中触发（携带进度百分比） */
  writing: [instance: TypewriterInstance]
  /** 打字结束时触发 */
  finish: [instance: TypewriterInstance]
}>()

const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
  breaks: true,
  highlight: (code, language) => {
    try {
      // 检查并修正可能的拼写错误
      if (Prism.languages[language]) {
        return Prism.highlight(code, Prism.languages[language], language)
      }
      else {
        return code // 返回原始代码，避免抛出异常
      }
    }
    catch (error) {
      console.error('Error during code highlighting:', error)
      return code // 返回原始代码，避免抛出异常
    }
  },
})
const typingIndex = ref(0)
const isTyping = ref(false)
let timer: ReturnType<typeof setTimeout> | null = null

// 配置合并逻辑修改
const mergedConfig: ComputedRef<TypingConfig> = computed(() => {
  const defaultConfig: TypingConfig = {
    step: typeof props.typing == 'object' ? props.typing.step ? props.typing.step : 2 : 2,
    interval: typeof props.typing == 'object' ? props.typing.interval ? props.typing.interval : 50 : 50,
    // 根据条件动态设置后缀
    suffix: props.isMarkdown ? '' : typeof props.typing == 'object' ? props.typing.suffix ? props.typing.suffix : '|' : '|',
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
      suffix: props.isMarkdown ? '' : props.typing.suffix,
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
  const displayed = props.content.slice(0, typingIndex.value)
  return displayed
})

// 计算属性
const typingProgress = computed(() => {
  return props.content
    ? Math.min((typingIndex.value / props.content.length) * 100, 100)
    : 0
})

// 修改渲染内容计算属性
const renderedContent = computed(() => {
  // 非Markdown模式直接返回
  if (!props.isMarkdown) {
    return processedContent.value
  }

  // Markdown模式添加安全过滤和样式类
  return DOMPurify.sanitize(
    md.render(processedContent.value),
  )
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

// 打字逻辑
watch(
  () => props.content,
  (newVal, oldVal) => {
    if (!props.typing) {
      typingIndex.value = newVal?.length || 0
      isTyping.value = false
      return
    }

    const shouldReset = !oldVal || !newVal?.startsWith(oldVal)
    if (shouldReset)
      typingIndex.value = 0

    nextTick(() => startTyping())
  },
  { immediate: true },
)

function startTyping() {
  clearTimeout(timer!)
  if (!props.typing || !props.content)
    return

  isTyping.value = true
  emit('start', instance)

  const typeNext = () => {
    typingIndex.value += mergedConfig.value.step!
    emit('writing', instance)

    if (typingIndex.value >= props.content!.length) {
      finishTyping()
      return
    }

    timer = setTimeout(typeNext, mergedConfig.value.interval)
  }

  timer = setTimeout(typeNext, mergedConfig.value.interval)
}

function finishTyping() {
  isTyping.value = false
  typingIndex.value = props.content?.length || 0
  emit('finish', instance)
}

// 公共方法
function interrupt() {
  clearTimeout(timer!)
  isTyping.value = false
}

function continueTyping() {
  if (typingIndex.value < (props.content?.length || 0)) {
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

// 生命周期
onUnmounted(destroy)

// 暴露方法
defineExpose(instance)
</script>

<template>
  <div class="typer-container">
    <div
      class="typer-content"
      :class="[
        {
          'markdown-content': isMarkdown,
          'typing-cursor': typing && mergedConfig.suffix && isTyping,
        },
        isMarkdown ? 'markdown-body' : '',
      ]"
      :style="{ '--cursor-char': `'${mergedConfig.suffix}'` }"
      v-html="renderedContent"
    />
  </div>
</template>

<style scoped lang="scss">
/* 修改光标样式 */
.typer-content.typing-cursor::after {
  content: var(--cursor-char);
  animation: blink 1s step-end infinite;
  margin-left: 2px;
  display: inline-block; /* 确保光标对齐 */
}

/* Markdown基础样式 */
.markdown-content :deep(ul) { list-style-type: disc; }
</style>
