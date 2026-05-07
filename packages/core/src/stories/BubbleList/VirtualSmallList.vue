<script setup lang="ts">
import type { MessageItem } from '@assets/mock';
import type {
  BubbleListInstance,
  BubbleListScrollState
} from '@components/BubbleList/types';
import BubbleList from '@components/BubbleList/index.vue';
import { createStorySequence } from './story-utils';

/**
 * 复现：开启 virtual=true 且消息条数较少时，
 * 首屏挂载后 BubbleList 滚动位置会停在错误位置，
 * 需要用户先往上滑动一段再往下滑动，才能看到最初渲染的内容。
 *
 * 关键复现条件：
 * 1. virtual=true（默认开启）
 * 2. 列表初始就带少量数据（3~5 条）
 * 3. 容器高度 > 全部消息累积高度（即根本不需要滚动也能放下）
 * 4. 至少有一条消息内容较长（强迫 virtua 估算高度 ≠ 真实高度）
 *
 * 触发原因（推测）：
 * - 首屏挂载时，watch(latestItemSignal) 仅做了一次 nextTick + scrollToBottom；
 * - 但 virtua 在第一帧使用估算高度定位，真实高度量出来后并未二次校正；
 * - watch(virtualEnabled) 里的 double rAF 校正没有 immediate，初始挂载不会触发。
 */

const bubbleListRef = ref<BubbleListInstance | null>(null);
const virtual = ref(true);
const messageCount = ref(4);
const scrollState = ref<BubbleListScrollState>('AT_BOTTOM');
const remountKey = ref(0);

const bubbleItems = computed<MessageItem[]>(() => {
  return createStorySequence({
    startKey: 1,
    count: messageCount.value,
    label: '小数据复现',
    startRole: 'ai'
  });
});

function handleScrollStateChange(state: BubbleListScrollState) {
  scrollState.value = state;
}

function remount() {
  // 强制重建组件以重现「首次挂载」的初始位置
  remountKey.value += 1;
}

function changeCount(next: number) {
  messageCount.value = next;
  remount();
}
</script>

<template>
  <div class="vsl-root">
    <div class="vsl-controls">
      <div class="vsl-controls__title">🐛 虚拟列表小数据首屏复现</div>
      <div class="vsl-controls__row">
        <span class="vsl-controls__label">virtual</span>
        <el-switch v-model="virtual" @change="remount" />
        <span class="vsl-controls__label">条数</span>
        <el-button-group>
          <el-button
            v-for="n in [2, 3, 4, 5, 8]"
            :key="n"
            size="small"
            :type="messageCount === n ? 'primary' : ''"
            @click="changeCount(n)"
          >
            {{ n }}
          </el-button>
        </el-button-group>
        <el-button size="small" @click="remount"> 重新挂载 </el-button>
        <el-button
          size="small"
          type="success"
          @click="bubbleListRef?.scrollToBottom(false)"
        >
          手动 scrollToBottom
        </el-button>
      </div>
      <div class="vsl-controls__hint">
        预期：内容应贴顶/贴底显示，无需任何滚动。
        <br />
        Bug：开启 virtual + 少量消息时，首屏视口可能停在「内容下方的空白处」，
        需先往上滑一点再回到底，内容才会回到正确位置。
      </div>
      <div class="vsl-controls__status">
        <span>scrollState：</span>
        <el-tag
          :type="scrollState === 'AT_BOTTOM' ? 'success' : 'warning'"
          size="small"
        >
          {{ scrollState }}
        </el-tag>
      </div>
    </div>

    <div class="vsl-stage">
      <BubbleList
        :key="remountKey"
        ref="bubbleListRef"
        :list="bubbleItems"
        :virtual="virtual"
        :auto-scroll="true"
        max-height="100%"
        :always-show-scrollbar="true"
        :show-back-button="true"
        item-key="key"
        @scroll-state-change="handleScrollStateChange"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
.vsl-root {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px;
  height: min(720px, calc(100vh - 32px));
  box-sizing: border-box;
}

.vsl-controls {
  display: flex;
  flex-direction: column;
  gap: 10px;
  border: 1px solid #e4e7ed;
  border-radius: 12px;
  padding: 14px;
  background: #fff;

  &__title {
    font-size: 15px;
    font-weight: 600;
    color: #303133;
  }

  &__row {
    display: flex;
    align-items: center;
    gap: 10px;
    flex-wrap: wrap;
  }

  &__label {
    font-size: 13px;
    color: #606266;
    font-family: monospace;
  }

  &__hint {
    padding: 10px 12px;
    border-radius: 8px;
    font-size: 12px;
    line-height: 1.6;
    background: #fef0f0;
    border: 1px solid #fde2e2;
    color: #b91c1c;
  }

  &__status {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 12px;
    color: #909399;
  }
}

.vsl-stage {
  flex: 1;
  min-height: 0;
  /* 关键：容器高度 >> 内容总高，几条消息根本撑不满 */
  padding: 12px;
  border-radius: 16px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  display: flex;
}

.vsl-stage :deep(.elx-bubble-list) {
  width: 100%;
  height: 100%;
  min-height: 0;
  flex: 1 1 0;
}
</style>
