<docs>
---
title: Back to Bottom Button
---

Built-in back-to-bottom button with configurable appearance, or fully customize it with the `#backToBottom` slot.

Adjust button behavior and style via `showBackButton`, `backButtonThreshold`, `backButtonPosition`, `btnColor` / `btnIconSize` / `btnLoading`, etc. When `autoScroll` is off, the button automatically shows an unread badge — the slot context provides `unreadCount` (current unread count) and `scrollToBottom()` (clears unread on call).
</docs>

<script setup lang="ts">
import type {
  BubbleListInstance,
  BubbleListScrollState
} from 'vue-element-plus-x/types/BubbleList';

interface MessageItem {
  key: number;
  role: 'user' | 'ai';
  placement: 'start' | 'end';
  content: string;
  loading: boolean;
  shape: 'round' | 'corner';
  variant: string;
  avatar: string;
  avatarSize: string;
}

const bubbleListRef = ref<BubbleListInstance | null>(null);

// ---- Control switches ----
const useCustomSlot = ref(false);
const autoScrollEnabled = ref(true);
const alwaysShowScrollbar = ref(false);

// ---- Built-in button props (default mode only) ----
const btnLoading = ref(true);
const btnColor = ref('#409EFF');
const btnSize = ref(24);
const bottomValue = ref(20);
const leftValue = ref(50);

// ---- State ----
const scrollState = ref<BubbleListScrollState>('AT_BOTTOM');
const unreadCount = ref(0);
let nextKey = 100;

const backButtonPosition = computed(() => ({
  bottom: `${bottomValue.value}%`,
  left: `${leftValue.value}%`,
  transform: 'translateX(-50%)'
}));

// ---- Initial data ----
const list = ref<MessageItem[]>(buildSeedList());

function buildSeedList(): MessageItem[] {
  const messages: MessageItem[] = [];
  for (let i = 0; i < 12; i++) {
    const role = i % 2 === 0 ? 'ai' : 'user';
    const placement = role === 'ai' ? 'start' : 'end';
    messages.push({
      key: i + 1,
      role,
      placement,
      content:
        role === 'ai'
          ? '💖 Thank you for using Element Plus X ! Your support is our strongest motivation for open source ~'.repeat(
              2
            )
          : `Hahaha, let me try message ${i + 1}`,
      loading: false,
      shape: 'corner',
      variant: role === 'ai' ? 'filled' : 'outlined',
      avatar:
        role === 'ai'
          ? 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png'
          : 'https://avatars.githubusercontent.com/u/76239030?v=4',
      avatarSize: '24px'
    });
  }
  nextKey = 13;
  return messages;
}

// ---- Actions ----
function appendMessage(role: 'user' | 'ai') {
  list.value.push({
    key: ++nextKey,
    role,
    placement: role === 'ai' ? 'start' : 'end',
    content:
      role === 'user'
        ? '📝 User appended message: a test message to observe how autoScroll affects scroll-to-bottom and unread behavior.'
        : '🤖 AI appended reply: when autoScroll is off, this message triggers unread count +1 and the back-to-bottom button will show a red badge.',
    loading: false,
    shape: 'corner',
    variant: role === 'ai' ? 'filled' : 'outlined',
    avatar:
      role === 'ai'
        ? 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png'
        : 'https://avatars.githubusercontent.com/u/76239030?v=4',
    avatarSize: '24px'
  });
}

function resetConversation() {
  list.value = buildSeedList();
  unreadCount.value = 0;
  nextTick(() => {
    bubbleListRef.value?.scrollToBottom(false);
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
  <div class="back-btn-demo">
    <!-- ====== Control Panel ====== -->
    <div class="control-panel">
      <!-- Core switches -->
      <div class="panel-section">
        <div class="section-title">Core Controls</div>

        <div class="control-row core-switch">
          <span class="switch-label">
            <strong>autoScroll</strong>
            <span class="switch-desc">
              {{
                autoScrollEnabled
                  ? 'Enabled — new messages auto-scroll to bottom, no unread'
                  : 'Disabled — accumulate unread, show badge'
              }}
            </span>
          </span>
          <el-switch
            v-model="autoScrollEnabled"
            active-text="On"
            inactive-text="Off"
          />
        </div>

        <div class="control-row">
          <span class="control-label">Custom slot (V2)</span>
          <el-switch
            v-model="useCustomSlot"
            inactive-text="Default button"
            active-text="Custom"
          />
        </div>

        <div class="control-row">
          <span class="control-label">Scrollbar display</span>
          <el-switch
            v-model="alwaysShowScrollbar"
            inactive-text="On hover"
            active-text="Always show"
          />
        </div>
      </div>

      <!-- Built-in button props (default mode only) -->
      <template v-if="!useCustomSlot">
        <div class="panel-section">
          <div class="section-title">Built-in Button Style</div>

          <div class="control-row">
            <span class="control-label">Loading animation</span>
            <el-switch
              v-model="btnLoading"
              inactive-text="Off"
              active-text="On"
            />
          </div>

          <div class="control-row">
            <span class="control-label">Button color</span>
            <el-color-picker v-model="btnColor" size="default" />
          </div>

          <div class="control-row">
            <span class="control-label">Icon size</span>
            <el-slider v-model="btnSize" :min="16" :max="48" style="flex: 1" />
          </div>
        </div>
      </template>

      <!-- Positioning props (effective in both modes) -->
      <div class="panel-section">
        <div class="section-title">
          Button Position
          <el-tag
            size="small"
            type="success"
            effect="plain"
            style="margin-left: 6px; vertical-align: middle"
          >
            Also applies in slot mode
          </el-tag>
        </div>
        <div class="control-row">
          <span class="control-label">Bottom %</span>
          <el-slider v-model="bottomValue" :min="0" :max="50" style="flex: 1" />
          <span class="control-value">{{ bottomValue }}%</span>
        </div>
        <div class="control-row">
          <span class="control-label">Horizontal %</span>
          <el-slider v-model="leftValue" :min="0" :max="100" style="flex: 1" />
          <span class="control-value">{{ leftValue }}%</span>
        </div>
      </div>

      <!-- Custom mode tip -->
      <div v-if="useCustomSlot" class="custom-tip">
        <span class="tip-badge">V2</span>
        <span
          >When using the custom <code>#backToBottom</code> slot, icon / color /
          size visual props are ignored. However,
          <strong>backButtonPosition</strong> (positioning) is controlled by the
          outer container — the position sliders above
          <strong>still take effect in real time</strong>.</span
        >
      </div>

      <!-- Action buttons -->
      <el-divider style="margin: 10px 0" />
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
        <el-button size="small" @click="resetConversation">
          Reset Session
        </el-button>
      </div>

      <!-- Behavior hint -->
      <div
        class="behavior-hint"
        :class="autoScrollEnabled ? 'hint-on' : 'hint-off'"
      >
        <div class="hint-icon">
          {{ autoScrollEnabled ? '✅' : '⚠️' }}
        </div>
        <div class="hint-text">
          <template v-if="autoScrollEnabled">
            <strong>autoScroll is ON</strong><br />
            After appending messages, the list auto-scrolls to the bottom.
            <strong>unreadCount stays 0</strong> and the back-to-bottom button
            won't appear.<br />
            Try: scroll up a bit first, then click "+ User Message" to see if it
            still auto-scrolls back.
          </template>
          <template v-else>
            <strong>autoScroll is OFF</strong><br />
            After appending messages, the list
            <strong>does not auto-scroll</strong>. Unread count increments per
            message, state becomes <code>HAS_NEW_MESSAGES</code>, and the
            back-to-bottom button appears with a
            <span class="badge-preview">red number badge</span>.<br />
            Click the back-to-bottom button to clear unread and restore state to
            <code>AT_BOTTOM</code>.
          </template>
        </div>
      </div>
    </div>

    <!-- ====== BubbleList ====== -->
    <div class="story-stage">
      <BubbleList
        ref="bubbleListRef"
        :list="list"
        :auto-scroll="autoScrollEnabled"
        :always-show-scrollbar="alwaysShowScrollbar"
        :show-back-button="true"
        :btn-color="useCustomSlot ? undefined : btnColor"
        :btn-loading="useCustomSlot ? undefined : btnLoading"
        :back-button-position="backButtonPosition"
        :btn-icon-size="useCustomSlot ? undefined : btnSize"
        @scroll-state-change="handleScrollStateChange"
        @unread-count-change="handleUnreadCountChange"
      >
        <!-- Custom back-to-bottom button (with unread badge) -->
        <template v-if="useCustomSlot" #backToBottom="context">
          <div
            class="custom-back-btn"
            :class="{ 'has-unread': context.unreadCount > 0 }"
            @click="context.scrollToBottom(true)"
          >
            <span class="custom-back-btn__icon">↓</span>
            <span class="custom-back-btn__text">
              {{
                context.unreadCount > 0
                  ? `${context.unreadCount > 99 ? '99+' : context.unreadCount} new messages`
                  : 'Back to bottom'
              }}
            </span>
            <span v-if="context.unreadCount > 0" class="custom-back-btn__badge">
              {{ context.unreadCount > 99 ? '99+' : context.unreadCount }}
            </span>
          </div>
        </template>
      </BubbleList>
    </div>

    <!-- ====== Status bar ====== -->
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
        <el-tag :type="autoScrollEnabled ? 'success' : 'danger'" size="small">
          {{ autoScrollEnabled ? 'ON' : 'OFF' }}
        </el-tag>
      </div>
      <div class="status-item">
        <span class="status-label">Button Mode</span>
        <el-tag :type="useCustomSlot ? 'warning' : 'info'" size="small">
          {{ useCustomSlot ? 'Custom Slot' : 'Built-in Default' }}
        </el-tag>
      </div>
    </div>
  </div>
</template>

<style scoped lang="less">
.back-btn-demo {
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

// ---- Control Panel ----
.control-panel {
  display: flex;
  flex-direction: column;
  gap: 8px;
  border: 1px solid #e4e7ed;
  border-radius: 12px;
  padding: 14px;

  .panel-section {
    display: flex;
    flex-direction: column;
    gap: 6px;

    & + .panel-section {
      margin-top: 6px;
      padding-top: 10px;
      border-top: 1px dashed #dcdfe6;
    }
  }

  .section-title {
    font-size: 13px;
    font-weight: 600;
    color: #303133;
    margin-bottom: 2px;
  }

  .control-row {
    display: flex;
    align-items: center;
    gap: 10px;

    .control-label {
      font-size: 13px;
      color: #606266;
      min-width: 100px;
    }

    .control-value {
      font-size: 12px;
      color: #409eff;
      min-width: 36px;
      font-family: ui-monospace, SFMono-Regular, Consolas, monospace;
    }
  }

  .core-switch {
    background: #fafafa;
    border-radius: 8px;
    padding: 10px 12px;
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

  // Behavior hint card
  .behavior-hint {
    margin-top: 4px;
    padding: 10px 12px;
    border-radius: 8px;
    font-size: 13px;
    line-height: 1.65;
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
    code {
      padding: 1px 5px;
      border-radius: 3px;
      background: rgba(0, 0, 0, 0.06);
      font-family: ui-monospace, SFMono-Regular, Consolas, monospace;
      font-size: 12px;
    }
    .badge-preview {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-width: 16px;
      height: 16px;
      padding: 0 4px;
      border-radius: 8px;
      background: #f56c6c;
      color: #fff;
      font-size: 11px;
      font-weight: 700;
      line-height: 1;
      vertical-align: middle;
    }
  }

  // V2 custom tip
  .custom-tip {
    margin-top: 4px;
    padding: 10px 12px;
    border-radius: 8px;
    background: linear-gradient(135deg, #f0f9eb 0%, #ecf5ff 100%);
    border: 1px solid #e1f3d8;
    font-size: 13px;
    color: #606266;
    line-height: 1.6;

    .tip-badge {
      display: inline-block;
      padding: 1px 8px;
      border-radius: 4px;
      background: #67c23a;
      color: #fff;
      font-size: 11px;
      font-weight: 700;
      margin-right: 6px;
      vertical-align: middle;
    }

    code {
      padding: 1px 5px;
      border-radius: 3px;
      background: rgba(0, 0, 0, 0.06);
      font-family: ui-monospace, SFMono-Regular, Consolas, monospace;
      font-size: 12px;
    }
  }
}

// ---- Status bar ----
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
  gap: 8px;
  padding: 10px 22px;
  border-radius: 24px;
  background: linear-gradient(135deg, #409eff 0%, #337ecc 100%);
  color: #fff;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  box-shadow: 0 4px 14px rgba(64, 158, 255, 0.35);
  transition: all 0.25s ease;
  user-select: none;
  z-index: 10;

  &:hover {
    transform: translateX(-50%) translateY(-2px);
    box-shadow: 0 6px 20px rgba(64, 158, 255, 0.5);
    background: linear-gradient(135deg, #66b1ff 0%, #409eff 100%);
  }

  &:active {
    transform: translateX(-50%) scale(0.96);
  }

  &.has-unread {
    animation: pulse-red 1.5s ease-in-out infinite;
  }

  &__icon {
    font-size: 16px;
    font-weight: 700;
  }

  &__text {
    white-space: nowrap;
  }

  &__badge {
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
}

@keyframes pulse-red {
  0%,
  100% {
    box-shadow: 0 4px 14px rgba(64, 158, 255, 0.35);
  }
  50% {
    box-shadow:
      0 4px 20px rgba(245, 108, 108, 0.6),
      0 0 0 4px rgba(245, 108, 108, 0.15);
  }
}
</style>
