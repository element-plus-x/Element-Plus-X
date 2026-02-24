<script setup lang="ts" generic="T extends BubbleProps">
import type { BubbleProps } from '../Bubble/types';
import type { BubbleListProps } from './types';
import { ArrowDownBold } from '@element-plus/icons-vue';
import { useNamespace } from '../../hooks/useNamespace';
import useScrollDetector from '../../utils/useScrollDetector.ts';
import Bubble from '../Bubble/index.vue';
import loadingBg from './loading.vue';

const props = withDefaults(defineProps<BubbleListProps<T>>(), {
  list: () => [] as T[],
  autoScroll: true,
  maxHeight: '',
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
const TOLERANCE = 30;
const ns = useNamespace('bubble-list');

const wrapperStyle = computed(() =>
  ns.cssVarBlock({
    'max-height': props.maxHeight || '100%',
    'btn-size': `${props.btnIconSize}px`
  })
);

const scrollContainer = ref<HTMLElement | null>(null);
const { hasVertical } = useScrollDetector(scrollContainer);
const stopAutoScrollToBottom = ref(false);
const resizeObserver = ref<ResizeObserver | null>(null);
const showBackToBottom = ref(false);

watch(
  () => props.list.length,
  () => {
    if (props.list && props.list.length > 0) {
      nextTick(() => {
        if (props.autoScroll) {
          autoScroll();
        }
      });
    }
  },
  { immediate: true }
);

function scrollToTop() {
  stopAutoScrollToBottom.value = true;
  nextTick(() => {
    scrollContainer.value!.scrollTop = 0;
  });
}

function scrollToBottom() {
  try {
    if (scrollContainer.value && scrollContainer.value.scrollHeight) {
      nextTick(() => {
        scrollContainer.value!.scrollTop = scrollContainer.value!.scrollHeight;
        stopAutoScrollToBottom.value = false;
      });
    }
  } catch (error) {
    console.warn('[BubbleList error]: ', error);
  }
}

function scrollToBubble(index: number) {
  const container = scrollContainer.value;
  if (!container) return;

  const bubbles = container.querySelectorAll(`.${ns.namespace.value}-bubble`);
  if (index >= bubbles.length) return;

  stopAutoScrollToBottom.value = true;
  const targetBubble = bubbles[index] as HTMLElement;

  const containerRect = container.getBoundingClientRect();
  const bubbleRect = targetBubble.getBoundingClientRect();

  const scrollPosition =
    bubbleRect.top - containerRect.top + container.scrollTop;

  container.scrollTo({
    top: scrollPosition,
    behavior: 'smooth'
  });
}

function autoScroll() {
  if (scrollContainer.value) {
    const listBubbles = scrollContainer.value!.querySelectorAll(
      `.${ns.namespace.value}-bubble__content-wrapper`
    );
    const secondLastItem = listBubbles[listBubbles.length - 2];
    const { top, bottom } = secondLastItem.getBoundingClientRect();
    const { top: containerTop, bottom: containerBottom } =
      scrollContainer.value!.getBoundingClientRect();
    const isVisible = top < containerBottom && bottom > containerTop;
    if (isVisible) {
      scrollToBottom();
      stopAutoScrollToBottom.value = false;
    }

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

function handleScroll() {
  if (scrollContainer.value) {
    const { scrollTop, scrollHeight, clientHeight } = scrollContainer.value;

    const distanceToBottom = scrollHeight - (scrollTop + clientHeight);
    showBackToBottom.value =
      props.showBackButton && distanceToBottom > props.backButtonThreshold;

    stopAutoScrollToBottom.value =
      scrollHeight - scrollTop - clientHeight > TOLERANCE;
  }
}

defineExpose({
  scrollToTop,
  scrollToBottom,
  scrollToBubble
});
</script>

<template>
  <div :class="ns.b()" :style="wrapperStyle">
    <div
      ref="scrollContainer"
      :class="[
        ns.e('list'),
        props.alwaysShowScrollbar ? ns.em('list', 'always-scrollbar') : ''
      ]"
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
        :max-width="item.maxWidth"
        :avatar="item.avatar"
        :avatar-size="item.avatarSize"
        :avatar-gap="item.avatarGap"
        :avatar-shape="item.avatarShape"
        :avatar-src-set="item.avatarSrcSet"
        :avatar-alt="item.avatarAlt"
        :avatar-fit="item.avatarFit"
        :no-style="item.noStyle"
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
    <div
      v-if="showBackToBottom && hasVertical"
      :class="[
        ns.e('back-button'),
        $slots.backToBottom ? ns.em('back-button', 'slot') : ''
      ]"
      :style="{
        bottom: backButtonPosition.bottom,
        left: backButtonPosition.left
      }"
      @click="scrollToBottom"
    >
      <slot name="backToBottom">
        <el-icon
          :class="ns.e('back-to-bottom-icon')"
          :style="{ color: props.btnColor }"
        >
          <ArrowDownBold />
          <loadingBg
            v-if="props.btnLoading"
            :class="ns.e('back-to-bottom-loading')"
          />
        </el-icon>
      </slot>
    </div>
  </div>
</template>

<style scoped lang="scss" src="./style.scss"></style>
