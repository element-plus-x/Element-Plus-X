<docs>
---
title: "Auto Scroll Control (autoScroll)"
---

`autoScroll` (default `true`) controls whether new messages automatically scroll to the bottom. When disabled, new messages accumulate unread count instead — this is a prerequisite for showing unread badges.

::: tip Special Behavior for Streaming Output
Even when `autoScroll` is enabled, streaming increments only follow when the user is at the bottom; scrolling up won't force a jump back, avoiding reading interruption.
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
        ? `User message ${i + 1}: Hi, I'd like to learn about BubbleList's auto-scroll feature.`
        : `AI reply ${i + 1}: BubbleList's autoScroll prop controls whether new messages automatically scroll to the bottom. Enabled by default.`,
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
        ? 'User appended message: This is a test message to observe the effect of the autoScroll toggle on auto-scrolling.'
        : 'AI appended reply: When autoScroll is enabled, this message will automatically appear in the visible area at the bottom.',
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
    <!-- Control Panel -->
    <div class="control-panel">
      <div class="panel-header">
        <span class="header-icon">⚙️</span>
        <span>AutoScroll Control Panel</span>
      </div>

      <!-- Core: autoScroll Toggle -->
      <div class="control-row core-switch">
        <span class="switch-label">
          <strong>autoScroll</strong>
          <span class="switch-desc">{{
            autoScroll
              ? 'Enabled — New messages auto-scroll to bottom'
              : 'Disabled — Accumulate unread, manual scroll needed'
          }}</span>
        </span>
        <el-switch v-model="autoScroll" active-text="ON" inactive-text="OFF" />
      </div>

      <el-divider style="margin: 8px 0" />

      <!-- Action Buttons -->
      <div class="action-buttons">
        <el-button
          type="primary"
          plain
          size="small"
          @click="appendMessage('user')"
        >
          + User Message
        </el-button>
        <el-button
          type="success"
          plain
          size="small"
          @click="appendMessage('ai')"
        >
          + AI Reply
        </el-button>
        <el-button size="small" @click="resetConversation"> Reset </el-button>
      </div>

      <!-- Behavior Hint -->
      <div class="behavior-hint" :class="autoScroll ? 'hint-on' : 'hint-off'">
        <div class="hint-icon">
          {{ autoScroll ? '✅' : '⚠️' }}
        </div>
        <div class="hint-text">
          <template v-if="autoScroll">
            <strong>Current mode: Auto-follow</strong><br />
            All new messages (user / AI) will automatically scroll to the
            bottom, unread count stays 0. Try scrolling up and then appending a
            message to see if it still auto-scrolls to bottom.
          </template>
          <template v-else>
            <strong>Current mode: Manual control</strong><br />
            New messages no longer trigger automatic scrolling, unread count
            starts accumulating. The back-to-bottom button will show a red
            number badge; clicking it smoothly scrolls to bottom and resets
            unread to zero.
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
        <!-- Custom back-to-bottom button (with unread badge) -->
        <template #backToBottom="context">
          <div
            class="custom-back-btn"
            :class="{ 'has-unread': context.unreadCount > 0 }"
            @click="context.scrollToBottom(true)"
          >
            <span class="btn-icon">↓</span>
            <span class="btn-text">Back to bottom</span>
            <span v-if="context.unreadCount > 0" class="btn-badge">
              {{ context.unreadCount > 99 ? '99+' : context.unreadCount }}
            </span>
          </div>
        </template>
      </BubbleList>
    </div>

    <!-- Status Bar -->
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

// ---- Custom back-to-bottom button (with unread badge) ----
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
