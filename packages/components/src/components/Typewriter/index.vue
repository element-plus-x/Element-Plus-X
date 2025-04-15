<script setup lang="ts">
import type { ComputedRef } from 'vue'
import type { TypewriterInstance, TypewriterProps, TypingConfig } from './types.d.ts'
import DOMPurify from 'dompurify' // 新增安全过滤
import MarkdownIt from 'markdown-it'
// 在组件中初始化时
import Prism from 'prismjs'
import 'github-markdown-css'
// import 'prismjs/themes/prism.css' // 样式影响其他组件库 暂时注释处理

const props = withDefaults(defineProps<TypewriterProps>(), {
  content: '',
  isMarkdown: false,
  typing: false,
  isFog: false,
})

const emit = defineEmits<{
  /** 开始打字时触发 */
  start: [instance: TypewriterInstance]
  /** 打字过程中触发（携带进度百分比） */
  writing: [instance: TypewriterInstance]
  /** 打字结束时触发 */
  finish: [instance: TypewriterInstance]
}>()

const markdownContentRef = ref<HTMLElement | null>(null)
const typeWriterRef = ref<HTMLElement | null>(null)

onMounted(() => {
  // 初始化雾化背景色
  updateFogColor()
})

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
      return code // 返回原始代码，避免抛出异常
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
  emit('start', instance)

  const typeNext = () => {
    typingIndex.value += mergedConfig.value.step!
    emit('writing', instance)

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
  emit('finish', instance)
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
      ref="markdownContentRef"
      class="typer-content"
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
      }"
      v-html="renderedContent"
    />
  </div>
</template>

<style scoped lang="scss">
/* Markdown基础样式 */
.markdown-content :deep(ul) { list-style-type: disc; }
// 新增 md 雾化效果
// 添加对 h1-h6, ol, ul 的特殊处理
.typing-markdown-cursor-foggy,.typing-cursor-foggy {
  &.markdown-content :deep() h1,
  &.markdown-content :deep() h2,
  &.markdown-content :deep() h3,
  &.markdown-content :deep() h4,
  &.markdown-content :deep() h5,
  &.markdown-content :deep() h6,
  &.markdown-content :deep() p,
  &.markdown-content :deep() ol:last-child li,
  &.markdown-content :deep() ul:last-child li {
    position: relative;
    overflow: hidden;
    &:last-child:after {
      content: '';
      width: var(--cursor-fog-width);
      height: 1.5em;
      background: linear-gradient(90deg, transparent, var(--cursor-fog-bg-color));
      position: absolute;
      margin-left: calc(-1 * var(--cursor-fog-width));
    }
  }
}

/* 修改光标样式 */
.typer-content.typing-cursor::after {
  content: var(--cursor-char);
  margin-left: 2px;
  display: inline-block; /* 确保光标对齐 */
}

// 新增 雾化样式
.typer-content.typing-cursor-foggy {
  position: relative;
  overflow: hidden;

  &:last-child:after {
    content: '';
    width: var(--cursor-fog-width);
    height: 100%;
    background: linear-gradient(90deg, transparent, var(--cursor-fog-bg-color));
    position: absolute;
    margin-left: calc(-1 * var(--cursor-fog-width));
  }
}
</style>
