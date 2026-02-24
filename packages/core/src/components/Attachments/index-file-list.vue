<script lang="ts" setup>
import type { FileListProps } from './types';
import { ArrowLeftBold, ArrowRightBold } from '@element-plus/icons-vue';
import { debounce } from 'radash';

const props = withDefaults(defineProps<FileListProps>(), {
  items: () => [],
  overflow: 'scrollX',
  listStyle: () => ({})
});

const containerRef = ref<HTMLDivElement | null>(null);
const wrapperRef = ref<HTMLDivElement | null>(null);
const firstMount = ref(false);
const pingStart = ref(false);
const pingEnd = ref(false);

const TOLERANCE = 1;

function checkPing() {
  const containerEle = containerRef.value;
  if (!containerEle) return;

  if (props.overflow === 'scrollX') {
    pingStart.value = Math.abs(containerEle.scrollLeft) >= TOLERANCE;
    pingEnd.value =
      containerEle.scrollWidth -
        containerEle.clientWidth -
        Math.abs(containerEle.scrollLeft) >=
      TOLERANCE;
  } else if (props.overflow === 'scrollY') {
    pingStart.value = containerEle.scrollTop !== 0;
    pingEnd.value =
      containerEle.scrollHeight - containerEle.clientHeight !==
      containerEle.scrollTop;
  } else {
    pingStart.value = false;
    pingEnd.value = false;
  }
}

function onScrollOffset(offset: -1 | 1) {
  const containerEle = containerRef.value;
  if (containerEle) {
    containerEle.scrollTo({
      left:
        props.overflow === 'scrollX'
          ? containerEle.scrollLeft + offset * containerEle.clientWidth
          : containerEle.scrollLeft,
      top:
        props.overflow === 'scrollY'
          ? containerEle.scrollTop + offset * containerEle.clientHeight
          : containerEle.scrollTop,
      behavior: 'smooth'
    });
  }
}

function onScrollLeft() {
  onScrollOffset(-1);
}

function onScrollRight() {
  onScrollOffset(1);
}

// 使用 debounce 对 checkPing 进行防抖处理
const debouncedCheckPing = debounce({ delay: 100 }, checkPing);

onMounted(() => {
  firstMount.value = true;
  nextTick(() => {
    checkPing();
  });
  // 监听窗口大小改变事件
  window.addEventListener('resize', debouncedCheckPing);
});

onUnmounted(() => {
  firstMount.value = false;
  // 移除窗口大小改变事件监听
  window.removeEventListener('resize', debouncedCheckPing);
});

watch(
  () => [props.overflow, props.items.length],
  () => {
    // 确保 DOM 更新后再调用 checkPing
    nextTick(() => {
      checkPing();
    });
  },
  {
    immediate: true, // 组件初始化时立即调用一次
    deep: true // 如果 items 是对象或数组，需要深度监听
  }
);
</script>

<template>
  <div
    ref="wrapperRef"
    class="elx-attachments-file-list-wrapper"
    :class="{
      'elx-attachments-file-list-overflow-ping-start':
        overflow === 'scrollX' && pingStart,
      'elx-attachments-file-list-overflow-ping-end':
        overflow === 'scrollX' && pingEnd
    }"
    :style="listStyle"
  >
    <!-- 背景层 -->
    <div class="elx-attachments-file-list-background">
      <div
        v-if="overflow === 'scrollX' && pingStart"
        class="elx-attachments-file-list-background-start"
      />
      <div
        v-if="overflow === 'scrollX' && pingEnd"
        class="elx-attachments-file-list-background-end"
      />
    </div>
    <div
      ref="containerRef"
      class="elx-attachments-file-list"
      :class="{
        [`elx-attachments-file-list-overflow-${overflow}`]: overflow
      }"
      :style="{
        ...(overflow === 'scrollX'
          ? { whiteSpace: 'nowrap', overflowX: 'auto', overflowY: 'hidden' }
          : {}),
        ...(overflow === 'scrollY'
          ? { overflowX: 'hidden', overflowY: 'auto' }
          : {}),
        ...(overflow === 'wrap' ? { display: 'flex', flexWrap: 'wrap' } : {})
      }"
      @scroll="checkPing"
    >
      <transition-group
        name="elx-attachments-card-motion"
        tag="div"
        :css="true"
        move-class="elx-attachments-card-motion-move"
      >
        <el-card
          v-for="item in items"
          :key="item.uid"
          class="elx-attachments-file-list-card"
        >
          <template #header>
            <span>{{ item.name }}</span>
          </template>
          <div>{{ item.description }}</div>
        </el-card>
      </transition-group>
    </div>

    <!-- 左侧按钮插槽（带默认内容） -->
    <slot
      name="prev-button"
      :show="overflow === 'scrollX' && pingStart"
      :on-scroll-left="onScrollLeft"
    >
      <el-button
        v-if="overflow === 'scrollX' && pingStart"
        size="small"
        class="elx-attachments-file-list-prev-btn"
        @click="onScrollLeft"
      >
        <el-icon><ArrowLeftBold /></el-icon>
      </el-button>
    </slot>

    <!-- 右侧按钮插槽（带默认内容） -->
    <slot
      name="next-button"
      :show="overflow === 'scrollX' && pingEnd"
      :on-scroll-right="onScrollRight"
    >
      <el-button
        v-if="overflow === 'scrollX' && pingEnd"
        size="small"
        class="elx-attachments-file-list-next-btn"
        @click="onScrollRight"
      >
        <el-icon><ArrowRightBold /></el-icon>
      </el-button>
    </slot>
  </div>
</template>

<style scoped>
/* 入场动画 */
.elx-attachments-card-motion-enter-active,
.elx-attachments-card-motion-move {
  transition: all 0.3s ease;
}

.elx-attachments-card-motion-leave-active {
  position: absolute;
  transition: all 0.3s ease;
  opacity: 0;
}

.elx-attachments-card-motion-enter-from,
.elx-attachments-card-motion-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* 卡片样式 */
.elx-attachments-file-list-card {
  display: inline-block;
  width: 200px;
  margin: 8px 10px;
}

/* 按钮位置样式（用户自定义按钮需保持相同定位） */
.elx-attachments-file-list-prev-btn,
.elx-attachments-file-list-next-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 10;
  /* 以下为默认样式，用户自定义时会覆盖 */
  background-color: var(--elx-attachments-nav-bg, rgba(0, 0, 0, 0.3));
  color: var(--elx-attachments-nav-color, #ffffff);
  border: none;
  padding: 4px 0px;
  border-radius: 3px;
  transition: background-color 0.3s ease;
}

.elx-attachments-file-list-prev-btn {
  left: 8px;
  border-top-left-radius: 0px;
  border-bottom-left-radius: 0px;
}

.elx-attachments-file-list-next-btn {
  right: 8px;
  border-top-right-radius: 0px;
  border-bottom-right-radius: 0px;
}

/* 背景层样式 */
.elx-attachments-file-list-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none; /* 让背景层不阻挡点击事件 */
}

.elx-attachments-file-list-background-start {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  width: 50px;
  background: linear-gradient(
    to right,
    rgba(var(--elx-attachments-fade-rgb, 255, 255, 255), 0.8),
    rgba(var(--elx-attachments-fade-rgb, 255, 255, 255), 0)
  );
}

.elx-attachments-file-list-background-end {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  width: 50px;
  background: linear-gradient(
    to left,
    rgba(var(--elx-attachments-fade-rgb, 255, 255, 255), 0.8),
    rgba(var(--elx-attachments-fade-rgb, 255, 255, 255), 0)
  );
}

/* 隐藏横向滚动条 */
.elx-attachments-file-list-overflow-scrollX {
  &::-webkit-scrollbar {
    display: none; /* 隐藏 Chrome/Safari 滚动条 */
  }
  scrollbar-width: none; /* 隐藏 Firefox 滚动条 */
}

.elx-attachments-file-list-wrapper {
  position: relative;
  display: block; /* 修复竖向布局问题 */
}

.elx-attachments-file-list {
  width: 100%;
  height: 100%;
}
</style>
