<script setup lang="ts" generic="T extends BubbleProps">
import type { BubbleProps } from '../Bubble/types'
import type { TypewriterInstance } from '../Typewriter/types.d.ts'
import type { BubbleListProps } from './types.d.ts'

import Bubble from '../Bubble/index.vue'

const props = withDefaults(defineProps<BubbleListProps<T>>(), {
  list: () => [] as T[],
  maxHeight: '500px',
  triggerIndices: 'only-last',
})

const emits = defineEmits(['complete'])

/* 在底部时候自动滚动 开始 */
// 滚动容器的引用
const scrollContainer = ref<HTMLDivElement | null>(null)
// 回复是否结束，只有回复结束，才会停止向底部滚动
const wasOver = ref(false)
// 上次滚动位置
const lastScrollTop = ref(0)
// 累积向上滚动距离
const accumulatedScrollUpDistance = ref(0)
// 阈值（像素）
const threshold = 15

/* 计算有效的触发索引数组 */
const effectiveTriggerIndices = computed(() => {
  if (props.triggerIndices === 'only-last') {
    // 定义一个 空数组，存储打字机属性的索引
    const triggerIndices: number[] = []
    if (props.list && props.list.length > 0) {
      for (let i = 0; i < props.list.length; i++) {
        const item = props.list[i]
        if (item.typing) {
          triggerIndices.push(i)
        }
      }
      return [triggerIndices[triggerIndices.length - 1]]
    }
    return []
  }
  else if (props.triggerIndices === 'all') {
    return props.list.map((_, index) => index)
  }
  else if (Array.isArray(props.triggerIndices)) {
    // 判断数组中的 index 是否在有效范围内
    const triggerIndices: number[] = []
    // 记录无效的索引
    const invalidIndices: number[] = []
    for (let i = 0; i < props.triggerIndices.length; i++) {
      const index = props.triggerIndices[i]
      if (index < 0 || index >= props.list.length) {
        invalidIndices.push(index)
      }
      // 判断索引是否在列表中开启了打字机效果
      if (!props.list[index].typing) {
        invalidIndices.push(index)
      }
      // 保存有效的索引
      if (index >= 0 && index < props.list.length && props.list[index].typing) {
        triggerIndices.push(index)
      }
    }
    if (invalidIndices && invalidIndices.length > 0) {
      console.warn(`无效索引 ${invalidIndices}`)
    }
    // 返回有效的索引
    if (triggerIndices && triggerIndices.length > 0) {
      return [triggerIndices[triggerIndices.length - 1]]
    }
    return []
  }
  return []
})

// 监听数组长度变化，如果改变，则判断是否在最底部，如果在，就自动滚动到底部
watch(
  () => props.list,
  () => {
    if (props.list && props.list.length > 0) {
      const node = props.list[props.list.length - 1]
      if (node.typing) {
        scrollToBottomByTyping()
      }
      else {
        scrollToBottom()
      }
    }
  },
  { deep: true, immediate: true },
)

// 父组件的触发方法，直接让滚动容器滚动到顶部
function scrollToTop() {
  // 处理在滚动时候，无法回到顶部的问题
  wasOver.value = true
  nextTick(() => {
    // 自动滚动到最顶部
    scrollContainer.value!.scrollTop = 0
  })
}
// 父组件的触发方法，不跟随打字器滚动，滚动底部
function scrollToBottom() {
  nextTick(() => {
    scrollContainer.value!.scrollTop = scrollContainer.value!.scrollHeight
  })
}
// 父组件触发滚动到指定气泡框
function scrollToBubble(index: number) {
  const container = scrollContainer.value
  if (!container)
    return

  const bubbles = container.querySelectorAll('.el-bubble')
  if (index >= bubbles.length)
    return

  wasOver.value = true
  const targetBubble = bubbles[index] as HTMLElement

  // 计算相对位置
  const containerRect = container.getBoundingClientRect()
  const bubbleRect = targetBubble.getBoundingClientRect()

  // 计算需要滚动的距离（元素顶部相对于容器顶部的位置 - 容器当前滚动位置）
  const scrollPosition = bubbleRect.top - containerRect.top + container.scrollTop

  // 使用容器自己的滚动方法
  container.scrollTo({
    top: scrollPosition,
    behavior: 'smooth',
  })
}
// 父组件的触发方法，跟随打字器滚动，滚动底部
function scrollToBottomByTyping() {
  scrollToBottom()
  wasOver.value = false
  const scrollTimer = setInterval(() => {
    // 如果最后气泡不开启打字机效果，直接关闭定时器
    const item = props.list[props.list.length - 1]
    if (!item.typing) {
      clearInterval(scrollTimer)
      wasOver.value = true
      nextTick(() => {
        scrollContainer.value!.scrollTop = scrollContainer.value!.scrollHeight
      })
      return false
    }
    // 获取最后一个开启打字机效果的气泡的 dom
    const doms = document.querySelectorAll('.el-bubble')
    if (doms && doms.length > 0) {
      const endDom = doms[doms.length - 1]
      // 如果最后一个气泡包含 el-bubble-is-typing 类名，就说明还在打字中，如果不包括，则打字结束
      if (!endDom.classList.contains('el-bubble-is-typing')) {
        clearInterval(scrollTimer)
        wasOver.value = true
        return false
      }
    }
    else {
      // 没有打字机节点，但是还是传入了打字机属性
      clearInterval(scrollTimer)
      wasOver.value = true
      nextTick(() => {
        scrollContainer.value!.scrollTop = scrollContainer.value!.scrollHeight
      })
      return false
    }

    if (wasOver.value) {
      clearInterval(scrollTimer)
      return false
    }
    nextTick(() => {
      scrollContainer.value!.scrollTop = scrollContainer.value!.scrollHeight
    })
  }, 30)
}
// 打字机播放完成回调（终止自动向下滚动）
function handleBubbleComplete(index: number, instance: TypewriterInstance) {
  if (effectiveTriggerIndices.value.includes(index)) {
    emits('complete', instance, index)
  }
  if (index === props.list.length - 1) {
    wasOver.value = true
  }
}

// 监听用户滚动事件
function handleScroll() {
  if (scrollContainer.value) {
    const { scrollTop, scrollHeight, clientHeight } = scrollContainer.value
    // 判断是否距离底部小于阈值 (这里吸附值大一些会体验更好)
    const isCloseToBottom = scrollTop + clientHeight >= scrollHeight - 30
    // 判断用户是否向上滚动
    const isScrollingUp = lastScrollTop.value > scrollTop
    // 判断用户是否向下滚动
    const isScrollingDown = lastScrollTop.value < scrollTop
    // 计算当前滚动距离的变化
    const scrollDelta = lastScrollTop.value - scrollTop
    // 更新上次滚动位置
    lastScrollTop.value = scrollTop
    // 处理向上滚动逻辑
    if (isScrollingUp) {
      // 累积向上滚动距离
      accumulatedScrollUpDistance.value += scrollDelta
      // 如果累积距离超过阈值，触发逻辑并重置累积距离
      if (accumulatedScrollUpDistance.value >= threshold) {
        // console.log(`用户向上滚动超过 ${threshold} 像素（累积）`)
        // 在这里执行你的操作
        // 如果打字器状态为 true，则停止滚动条的滚动，由用户控制
        if (!wasOver.value) {
          wasOver.value = true
        }
        // 重置累积距离
        accumulatedScrollUpDistance.value = 0
      }
    }
    else {
      // 如果用户停止向上滚动或开始向下滚动，重置累积距离
      accumulatedScrollUpDistance.value = 0
    }
    // 处理向下滚动且接近底部的逻辑
    if (isScrollingDown && isCloseToBottom) {
      // console.log(`用户向下滚动且距离底部小于 ${threshold} 像素`)
      // 在这里执行你的操作
      if (wasOver.value) {
        // 如果已经终止自动滚动，并且打字机是否正在打字中，如果是则开启自动滚动
        scrollToBottomByTyping()
      }
    }
  }
}
/* 在底部时候自动滚动 结束 */

defineExpose({
  scrollToTop,
  scrollToBottom,
  scrollToBubble,
  // scrollToBottomByTyping,
})
</script>

<template>
  <div
    ref="scrollContainer"
    class="el-bubble-list scroll-container"
    :style="{
      '--el-bubble-list-max-height': `${maxHeight}`,
    }"
    @scroll="handleScroll"
  >
    <Bubble
      v-for="(item, index) in list"
      :key="index"
      :content="item.content"
      :placement="item.placement"
      :loading="item.loading"
      :shape="item.shape"
      :variant="item.variant"
      :is-markdown="item.isMarkdown"
      :code-high-light-options="item.codeHighLightOptions"
      :typing="item.typing"
      :avatar="item.avatar"
      :avatar-size="item.avatarSize"
      :avatar-gap="item.avatarGap"
      :avatar-shape="item.avatarShape"
      :avatar-icon="item.avatarIcon"
      :avatar-src-set="item.avatarSrcSet"
      :avatar-alt="item.avatarAlt"
      :avatar-fit="item.avatarFit"
      :no-style="item.noStyle"
      @finish="(instance) => handleBubbleComplete(index, instance)"
    >
      <template v-if="$slots.avatar" #avatar>
        <slot name="avatar" :item="item" />
      </template>
      <template v-if="$slots.header" #header>
        <slot name="header" :item="item" />
      </template>
      <template v-if="$slots.content" #content>
        <slot name="content" :item="item" />
      </template>
      <template v-if="$slots.footer" #footer>
        <slot name="footer" :item="item" />
      </template>
      <template v-if="$slots.loading" #loading>
        <slot name="loading" :item="item" />
      </template>
    </Bubble>
  </div>
</template>

<style scoped>
.el-bubble-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
  min-height: 0;
  max-height: var(--el-bubble-list-max-height);
  overflow-y: auto;
  scroll-behavior: smooth;
}
</style>
