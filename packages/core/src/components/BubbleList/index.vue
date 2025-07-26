<script setup lang="ts" generic="T extends BubbleProps">
import type { BubbleProps } from '../Bubble/types';
import type { TypewriterInstance } from '../Typewriter/types.d.ts';
import type { BubbleListEmits, BubbleListProps } from './types.d.ts';
import { ArrowDownBold } from '@element-plus/icons-vue';
import useScrollDetector from '../../utils/useScrollDetector.ts';
import Bubble from '../Bubble/index.vue';
import loadingBg from './loading.vue';

const props = withDefaults(defineProps<BubbleListProps<T>>(), {
  list: () => [] as T[],
  maxHeight: '500px',
  triggerIndices: 'only-last',
  alwaysShowScrollbar: false,
  backButtonThreshold: 80,
  showBackButton: true,
  backButtonPosition: () => {
    return { bottom: '20px', left: 'calc(50% - 19px)' };
  },
  btnLoading: true,
  btnColor: '#409EFF',
  btnIconSize: 24
});

const emits = defineEmits<BubbleListEmits>();

function initStyle() {
  document.documentElement.style.setProperty(
    '--el-bubble-list-max-height',
    props.maxHeight
  );
  document.documentElement.style.setProperty(
    '--el-bubble-list-btn-size',
    `${props.btnIconSize}px`
  );
}

onMounted(() => {
  initStyle();
});

/* 在底部时候自动滚动 开始 */
// 滚动容器的引用
const scrollContainer = ref<HTMLElement | null>(null);
const { hasVertical } = useScrollDetector(scrollContainer);
// 是否停止自动滚动
const stopAutoScrollToBottom = ref(false);
// 上次滚动位置
const lastScrollTop = ref(0);
// 累积向上滚动距离
const accumulatedScrollUpDistance = ref(0);
// 阈值（像素）
const threshold = 20;
const resizeObserver = ref<ResizeObserver | null>(null);
const showBackToBottom = ref(false); // 控制按钮显示

// 监听数组长度变化，如果改变，则判断是否在最底部，如果在，就自动滚动到底部
watch(
  () => props.list.length,
  () => {
    if (props.list && props.list.length > 0) {
      nextTick(() => {
        // 每次添加新的气泡，等页面渲染后，在执行自动滚动
        autoScroll();
      });
    }
  },
  { immediate: true }
);

// 父组件的触发方法，直接让滚动容器滚动到顶部
function scrollToTop() {
  // 处理在滚动时候，无法回到顶部的问题
  stopAutoScrollToBottom.value = true;
  nextTick(() => {
    // 自动滚动到最顶部
    scrollContainer.value!.scrollTop = 0;
  });
}
// 父组件的触发方法，不跟随打字器滚动，滚动底部
function scrollToBottom() {
  try {
    if (scrollContainer.value && scrollContainer.value.scrollHeight) {
      nextTick(() => {
        scrollContainer.value!.scrollTop = scrollContainer.value!.scrollHeight;
        // 修复清空BubbleList后，再次调用 scrollToBottom()，不触发自动滚动问题
        stopAutoScrollToBottom.value = false;
      });
    }
  } catch (error) {
    console.warn('[BubbleList error]: ', error);
  }
}
// 父组件触发滚动到指定气泡框
function scrollToBubble(index: number) {
  const container = scrollContainer.value;
  if (!container) return;

  const bubbles = container.querySelectorAll('.el-bubble');
  if (index >= bubbles.length) return;

  stopAutoScrollToBottom.value = true;
  const targetBubble = bubbles[index] as HTMLElement;

  // 计算相对位置
  const containerRect = container.getBoundingClientRect();
  const bubbleRect = targetBubble.getBoundingClientRect();

  // 计算需要滚动的距离（元素顶部相对于容器顶部的位置 - 容器当前滚动位置）
  const scrollPosition =
    bubbleRect.top - containerRect.top + container.scrollTop;

  // 使用容器自己的滚动方法
  container.scrollTo({
    top: scrollPosition,
    behavior: 'smooth'
  });
}
// 组件内部触发方法，跟随打字器滚动，滚动底部
function autoScroll() {
  if (scrollContainer.value) {
    const listBubbles = scrollContainer.value!.querySelectorAll(
      '.el-bubble-content-wrapper'
    );
    // 如果页面上有监听节点，先移除
    if (resizeObserver.value) {
      resizeObserver.value.disconnect();
    }
    const lastItem = listBubbles[listBubbles.length - 1];
    if (lastItem) {
      resizeObserver.value = new ResizeObserver(() => {
        if (!stopAutoScrollToBottom.value) {
          scrollToBottom();
        }
      });
      resizeObserver.value.observe(lastItem);
    }
  }
}

const completeMap = ref<Record<number, TypewriterInstance>>({});
const typingList = computed(() =>
  props.list
    .map((item, _index_) => ({ ...item, _index_ }))
    .filter(item => item.typing)
);
// 打字机播放完成回调
function handleBubbleComplete(index: number, instance: TypewriterInstance) {
  switch (props.triggerIndices) {
    case 'only-last':
      if (index === typingList.value[typingList.value.length - 1]?._index_) {
        emits('complete', instance, index);
      }
      break;
    case 'all':
      completeMap.value[index] = instance;
      if (Object.keys(completeMap.value).length === typingList.value.length) {
        emits('complete', instance, index);
      }
      break;
    default:
      props.triggerIndices.includes(index) &&
        emits('complete', instance, index);
      break;
  }
}

// 监听用户滚动事件
function handleScroll() {
  if (scrollContainer.value) {
    const { scrollTop, scrollHeight, clientHeight } = scrollContainer.value;

    // 计算是否超过安全距离
    const distanceToBottom = scrollHeight - (scrollTop + clientHeight);
    showBackToBottom.value =
      props.showBackButton && distanceToBottom > props.backButtonThreshold;

    // 处理 lastScrollTop.value 安全距离(scrollHeight 在滚动过程中变小)
    const maxScrollTop = scrollHeight - clientHeight;
    if (lastScrollTop.value > maxScrollTop) {
      lastScrollTop.value = maxScrollTop;
    }

    // 判断是否距离底部小于阈值 (这里吸附值大一些会体验更好)
    const isCloseToBottom = scrollTop + clientHeight >= scrollHeight - 30;
    // 判断用户是否向上滚动
    const isScrollingUp = lastScrollTop.value > scrollTop;
    // 判断用户是否向下滚动
    const isScrollingDown = lastScrollTop.value < scrollTop;
    // 计算当前滚动距离的变化
    const scrollDelta = lastScrollTop.value - scrollTop;
    // 更新上次滚动位置
    lastScrollTop.value = scrollTop;
    // 处理向上滚动逻辑
    if (isScrollingUp) {
      // 累积向上滚动距离
      accumulatedScrollUpDistance.value += scrollDelta;
      // 如果累积距离超过阈值，触发逻辑并重置累积距离
      if (accumulatedScrollUpDistance.value >= threshold) {
        // console.log(`用户向上滚动超过 ${threshold} 像素（累积）${stopAutoScrollToBottom.value}`)
        // 在这里执行你的操作
        if (!stopAutoScrollToBottom.value) {
          stopAutoScrollToBottom.value = true;
        }
        // 重置累积距离
        accumulatedScrollUpDistance.value = 0;
      }
    } else {
      // 如果用户停止向上滚动或开始向下滚动，重置累积距离
      accumulatedScrollUpDistance.value = 0;
    }
    // 处理向下滚动且接近底部的逻辑
    if (isScrollingDown && isCloseToBottom) {
      // console.log(`用户向下滚动且距离底部小于 ${threshold} 像素`)
      // 在这里执行你的操作
      if (stopAutoScrollToBottom.value) {
        stopAutoScrollToBottom.value = false;
      }
    }
  }
}
/* 在底部时候自动滚动 结束 */

defineExpose({
  scrollToTop,
  scrollToBottom,
  scrollToBubble
});
</script>

<template>
  <div
    ref="scrollContainer"
    class="el-bubble-list"
    :class="{ 'always-scrollbar': props.alwaysShowScrollbar }"
    @scroll="handleScroll"
  >
    <!-- 如果给 BubbleList 的 item 传入 md 配置，则按照 item 的 md 配置渲染 -->
    <!-- 否则，则按照 BubbleList 的 md 配置渲染 -->
    <Bubble
      v-for="(item, index) in list"
      :key="index"
      :content="item.content"
      :placement="item.placement"
      :loading="item.loading"
      :shape="item.shape"
      :variant="item.variant"
      :is-markdown="item.isMarkdown"
      :is-fog="item.isFog"
      :typing="item.typing"
      :max-width="item.maxWidth"
      :avatar="item.avatar"
      :avatar-size="item.avatarSize"
      :avatar-gap="item.avatarGap"
      :avatar-shape="item.avatarShape"
      :avatar-src-set="item.avatarSrcSet"
      :avatar-alt="item.avatarAlt"
      :avatar-fit="item.avatarFit"
      :no-style="item.noStyle"
      @finish="instance => handleBubbleComplete(index, instance)"
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

    <!-- 自定义按钮插槽 默认返回按钮 -->
    <div
      v-if="showBackToBottom && hasVertical"
      class="el-bubble-list-default-back-button"
      :class="{
        'el-bubble-list-back-to-bottom-solt': $slots.backToBottom
      }"
      :style="{
        bottom: backButtonPosition.bottom,
        left: backButtonPosition.left
      }"
      @click="scrollToBottom"
    >
      <slot name="backToBottom">
        <el-icon
          class="el-bubble-list-back-to-bottom-icon"
          :style="{ color: props.btnColor }"
        >
          <ArrowDownBold />
          <loadingBg
            v-if="props.btnLoading"
            class="back-to-bottom-loading-svg-bg"
          />
        </el-icon>
      </slot>
    </div>
  </div>
</template>

<style scoped lang="scss" src="./style.scss"></style>
