<docs>
---
title: 自动触底控制（autoScroll）
---

`autoScroll`（默认 `true`）控制追加新消息时是否自动滚到底部。关闭后，新消息不再自动触底，而是累计未读计数——这是显示未读角标的前提。

::: tip 流式输出的特殊行为
即使 `autoScroll` 开启，流式增量也只在用户处于底部时跟随；上滑后不强制拉回，避免打断阅读。
:::
</docs>

<script setup lang="ts">
import type {
  BubbleListInstance,
  BubbleListScrollState
} from 'vue-element-plus-x/types/BubbleList';

interface MessageItem {
  key: number;
  role: 'user' | 'ai';
  content: string;
  placement: 'start' | 'end';
  loading?: boolean;
}

const bubbleListRef = ref<BubbleListInstance | null>(null);
const autoScroll = ref(true);
const scrollState = ref<BubbleListScrollState>('AT_BOTTOM');
const unreadCount = ref(0);
let nextKey = 100;

const bubbleItems = ref<MessageItem[]>(buildSeedList());

function buildSeedList(): MessageItem[] {
  const list: MessageItem[] = [];
  for (let i = 0; i < 8; i++) {
    const isUser = i % 2 !== 0;
    list.push({
      key: i + 1,
      role: isUser ? 'user' : 'ai',
      content: isUser
        ? `用户消息 ${i + 1}：你好，我想了解一下 BubbleList 的自动滚动功能。`
        : `AI 回复 ${i + 1}：BubbleList 的 autoScroll 属性控制新消息是否自动滚动到底部。默认开启。`,
      placement: isUser ? 'end' : 'start'
    });
  }
  nextKey = 9;
  return list;
}

function resetConversation() {
  bubbleItems.value = buildSeedList();
  nextTick(() => {
    bubbleListRef.value?.scrollToBottom(false);
  });
}

function appendMessage(role: 'user' | 'ai') {
  bubbleItems.value.push({
    key: ++nextKey,
    role,
    content:
      role === 'user'
        ? '用户追加消息：这是一条测试消息，用于观察 autoScroll 开关对自动触底的影响。'
        : 'AI 追加回复：当 autoScroll 开启时，此消息会自动出现在底部可视区域。',
    placement: role === 'user' ? 'end' : 'start'
  });
}

function handleScrollStateChange(state: BubbleListScrollState) {
  scrollState.value = state;
}

function handleUnreadCountChange(count: number) {
  unreadCount.value = count;
}
</script>

<template>
  <div class="autoscroll-demo">
    <!-- 控制面板 -->
    <div class="control-panel">
      <div class="panel-header">
        <span class="header-icon">⚙️</span>
        <span>AutoScroll 自动触底控制台</span>
      </div>

      <!-- 核心：autoScroll 开关 -->
      <div class="control-row core-switch">
        <span class="switch-label">
          <strong>autoScroll</strong>
          <span class="switch-desc">{{
            autoScroll
              ? '已开启 — 新消息自动触底'
              : '已关闭 — 累计未读，需手动回底'
          }}</span>
        </span>
        <el-switch
          v-model="autoScroll"
          active-text="开启"
          inactive-text="关闭"
        />
      </div>

      <el-divider style="margin: 8px 0" />

      <!-- 操作按钮 -->
      <div class="action-buttons">
        <el-button
          type="primary"
          plain
          size="small"
          @click="appendMessage('user')"
        >
          + 用户消息
        </el-button>
        <el-button
          type="success"
          plain
          size="small"
          @click="appendMessage('ai')"
        >
          + AI 回复
        </el-button>
        <el-button size="small" @click="resetConversation">
          重置会话
        </el-button>
      </div>

      <!-- 行为说明 -->
      <div class="behavior-hint" :class="autoScroll ? 'hint-on' : 'hint-off'">
        <div class="hint-icon">
          {{ autoScroll ? '✅' : '⚠️' }}
        </div>
        <div class="hint-text">
          <template v-if="autoScroll">
            <strong>当前模式：自动追底</strong><br />
            所有新消息（用户 / AI）都会自动滚动到底部，未读计数始终为 0。
            尝试向上滚动后再点追加消息，观察是否仍然自动回底。
          </template>
          <template v-else>
            <strong>当前模式：手动控制</strong><br />
            新消息不再自动触发滚动，未读数开始累计。
            回底按钮将显示红色数字角标，点击后平滑滚到底部并清零未读。
          </template>
        </div>
      </div>
    </div>

    <!-- BubbleList -->
    <div class="story-stage">
      <BubbleList
        ref="bubbleListRef"
        :list="bubbleItems"
        :auto-scroll="autoScroll"
        :always-show-scrollbar="true"
        :show-back-button="true"
        @scroll-state-change="handleScrollStateChange"
        @unread-count-change="handleUnreadCountChange"
      >
        <!-- 自定义回底按钮（带未读角标） -->
        <template #backToBottom="context">
          <div
            class="custom-back-btn"
            :class="{ 'has-unread': context.unreadCount > 0 }"
            @click="context.scrollToBottom(true)"
          >
            <span class="btn-icon">↓</span>
            <span class="btn-text">回到底部</span>
            <span v-if="context.unreadCount > 0" class="btn-badge">
              {{ context.unreadCount > 99 ? '99+' : context.unreadCount }}
            </span>
          </div>
        </template>
      </BubbleList>
    </div>

    <!-- 状态栏 -->
    <div class="status-bar">
      <div class="status-item">
        <span class="status-label">scrollState</span>
        <el-tag
          :type="
            scrollState === 'AT_BOTTOM'
              ? 'success'
              : scrollState === 'SCROLLED_UP'
                ? 'warning'
                : 'danger'
          "
          size="small"
        >
          {{ scrollState }}
        </el-tag>
      </div>
      <div class="status-item">
        <span class="status-label">unreadCount</span>
        <el-tag :type="unreadCount > 0 ? 'danger' : 'info'" size="small">
          {{ unreadCount }}
        </el-tag>
      </div>
      <div class="status-item">
        <span class="status-label">autoScroll</span>
        <el-tag :type="autoScroll ? 'success' : 'danger'" size="small">
          {{ autoScroll ? 'ON' : 'OFF' }}
        </el-tag>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.autoscroll-demo {
  display: flex;
  flex-direction: column;
  gap: 12px;

  .story-stage {
    height: 450px;
    padding: 8px 10px;
    border-radius: 16px;
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    overflow: hidden;
  }
}

.control-panel {
  border: 1px solid #e4e7ed;
  border-radius: 12px;
  padding: 16px;

  .panel-header {
    font-size: 15px;
    font-weight: 600;
    color: #303133;
    margin-bottom: 12px;
    display: flex;
    align-items: center;
    gap: 6px;

    .header-icon {
      font-size: 18px;
    }
  }

  .core-switch {
    background: #fafafa;
    border-radius: 8px;
    padding: 12px 14px;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .switch-label {
      display: flex;
      flex-direction: column;
      gap: 2px;

      strong {
        color: #303133;
        font-size: 14px;
      }
      .switch-desc {
        font-size: 12px;
        color: #909399;
      }
    }
  }

  .action-buttons {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
  }

  .behavior-hint {
    margin-top: 10px;
    padding: 10px 12px;
    border-radius: 8px;
    font-size: 13px;
    line-height: 1.6;
    display: flex;
    gap: 8px;

    &.hint-on {
      background: #f0f9eb;
      border: 1px solid #e1f3d8;
      color: #67c23a;
    }

    &.hint-off {
      background: #fef0f0;
      border: 1px solid #fde2e2;
      color: #f56c6c;
    }

    .hint-icon {
      font-size: 18px;
      flex-shrink: 0;
      margin-top: 1px;
    }

    strong {
      font-weight: 600;
    }
  }
}

.status-bar {
  display: flex;
  gap: 16px;
  padding: 10px 14px;
  background: #f5f7fa;
  border-radius: 8px;
  flex-wrap: wrap;

  .status-item {
    display: flex;
    align-items: center;
    gap: 6px;

    .status-label {
      font-size: 12px;
      color: #909399;
      font-family: ui-monospace, SFMono-Regular, Consolas, monospace;
    }
  }
}

// ---- 自定义回底按钮（带未读角标） ----
.custom-back-btn {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 18px;
  border-radius: 20px;
  background: linear-gradient(135deg, #409eff 0%, #337ecc 100%);
  color: #fff;
  font-size: 13px;
  cursor: pointer;
  box-shadow: 0 2px 12px rgba(64, 158, 255, 0.35);
  transition: all 0.25s ease;
  user-select: none;
  z-index: 10;

  &:hover {
    transform: translateX(-50%) scale(1.05);
    box-shadow: 0 4px 20px rgba(64, 158, 255, 0.5);
  }

  &:active {
    transform: translateX(-50%) scale(0.97);
  }

  .btn-icon {
    font-size: 14px;
    font-weight: 700;
  }
  .btn-text {
    white-space: nowrap;
  }

  .btn-badge {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 18px;
    height: 18px;
    padding: 0 5px;
    border-radius: 9px;
    background: #f56c6c;
    color: #fff;
    font-size: 11px;
    font-weight: 700;
    line-height: 1;
  }

  &.has-unread {
    animation: pulse-red 1.5s ease-in-out infinite;
  }
}

@keyframes pulse-red {
  0%,
  100% {
    box-shadow: 0 2px 12px rgba(64, 158, 255, 0.35);
  }
  50% {
    box-shadow:
      0 2px 20px rgba(245, 108, 108, 0.6),
      0 0 0 4px rgba(245, 108, 108, 0.15);
  }
}
</style>
