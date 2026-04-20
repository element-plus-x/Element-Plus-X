<docs>
---
title: 返回底部按钮
---

内置回底按钮，支持属性配置外观，也可通过 `#backToBottom` 插槽完全自定义。

通过 `showBackButton`、`backButtonThreshold`、`backButtonPosition`、`btnColor` / `btnIconSize` / `btnLoading` 等属性调整按钮行为与样式。关闭 `autoScroll` 后，按钮上会自动出现未读角标，插槽上下文中的 `unreadCount` 即为当前未读数，`scrollToBottom()` 调用后自动清零。
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

// ---- 控制开关 ----
const useCustomSlot = ref(false);
const autoScrollEnabled = ref(true);
const alwaysShowScrollbar = ref(false);

// ---- 内置按钮属性（仅默认模式） ----
const btnLoading = ref(true);
const btnColor = ref('#409EFF');
const btnSize = ref(24);
const bottomValue = ref(20);
const leftValue = ref(50);

// ---- 状态 ----
const scrollState = ref<BubbleListScrollState>('AT_BOTTOM');
const unreadCount = ref(0);
let nextKey = 100;

const backButtonPosition = computed(() => ({
  bottom: `${bottomValue.value}%`,
  left: `${leftValue.value}%`,
  transform: 'translateX(-50%)'
}));

// ---- 初始数据 ----
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
          ? '💖 感谢使用 Element Plus X ! 你的支持，是我们开源的最强动力 ~'.repeat(
              2
            )
          : `哈哈哈，让我试试第 ${i + 1} 条消息`,
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

// ---- 操作 ----
function appendMessage(role: 'user' | 'ai') {
  list.value.push({
    key: ++nextKey,
    role,
    placement: role === 'ai' ? 'start' : 'end',
    content:
      role === 'user'
        ? '📝 用户追加消息：这是一条测试消息，用于观察 autoScroll 对触底和未读的影响。'
        : '🤖 AI 追加回复：当 autoScroll 关闭时，此消息会触发未读计数 +1，回底按钮将带红色角标。',
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
    <!-- ====== 控制面板 ====== -->
    <div class="control-panel">
      <!-- 核心开关区 -->
      <div class="panel-section">
        <div class="section-title">核心控制</div>

        <div class="control-row core-switch">
          <span class="switch-label">
            <strong>autoScroll</strong>
            <span class="switch-desc">
              {{
                autoScrollEnabled
                  ? '已开启 — 新消息自动触底，无未读'
                  : '已关闭 — 累计未读，显示角标'
              }}
            </span>
          </span>
          <el-switch
            v-model="autoScrollEnabled"
            active-text="开启"
            inactive-text="关闭"
          />
        </div>

        <div class="control-row">
          <span class="control-label">自定义插槽 (V2)</span>
          <el-switch
            v-model="useCustomSlot"
            inactive-text="默认按钮"
            active-text="自定义"
          />
        </div>

        <div class="control-row">
          <span class="control-label">滚动条显示</span>
          <el-switch
            v-model="alwaysShowScrollbar"
            inactive-text="鼠标悬停"
            active-text="一直展示"
          />
        </div>
      </div>

      <!-- 内置按钮属性（仅默认模式） -->
      <template v-if="!useCustomSlot">
        <div class="panel-section">
          <div class="section-title">内置按钮样式</div>

          <div class="control-row">
            <span class="control-label">Loading 动效</span>
            <el-switch
              v-model="btnLoading"
              inactive-text="关闭"
              active-text="开启"
            />
          </div>

          <div class="control-row">
            <span class="control-label">按钮颜色</span>
            <el-color-picker v-model="btnColor" size="default" />
          </div>

          <div class="control-row">
            <span class="control-label">图标大小</span>
            <el-slider v-model="btnSize" :min="16" :max="48" style="flex: 1" />
          </div>
        </div>
      </template>

      <!-- 定位属性（两种模式均生效） -->
      <div class="panel-section">
        <div class="section-title">
          按钮定位
          <el-tag
            size="small"
            type="success"
            effect="plain"
            style="margin-left: 6px; vertical-align: middle"
          >
            插槽模式也生效
          </el-tag>
        </div>
        <div class="control-row">
          <span class="control-label">距底部 %</span>
          <el-slider v-model="bottomValue" :min="0" :max="50" style="flex: 1" />
          <span class="control-value">{{ bottomValue }}%</span>
        </div>
        <div class="control-row">
          <span class="control-label">水平位置 %</span>
          <el-slider v-model="leftValue" :min="0" :max="100" style="flex: 1" />
          <span class="control-value">{{ leftValue }}%</span>
        </div>
      </div>

      <!-- 自定义模式提示 -->
      <div v-if="useCustomSlot" class="custom-tip">
        <span class="tip-badge">V2</span>
        <span
          >自定义 <code>#backToBottom</code> 插槽时，icon / 颜色 /
          大小等视觉属性失效，但
          <strong>backButtonPosition</strong
          >（位置定位）由外层容器控制，上方定位滑块<strong>仍然实时生效</strong>。</span
        >
      </div>

      <!-- 操作按钮 -->
      <el-divider style="margin: 10px 0" />
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
      <div
        class="behavior-hint"
        :class="autoScrollEnabled ? 'hint-on' : 'hint-off'"
      >
        <div class="hint-icon">
          {{ autoScrollEnabled ? '✅' : '⚠️' }}
        </div>
        <div class="hint-text">
          <template v-if="autoScrollEnabled">
            <strong>autoScroll 开启中</strong><br />
            追加消息后自动滚到底部，<strong>unreadCount 始终为 0</strong
            >，回底按钮不会出现。<br />
            尝试：先向上滚动一段距离，再点「+ 用户消息」，观察是否仍自动回底。
          </template>
          <template v-else>
            <strong>autoScroll 已关闭</strong><br />
            追加消息后<strong>不自动滚动</strong>，未读数逐条 +1，状态变为
            <code>HAS_NEW_MESSAGES</code>，回底按钮浮现并带<span
              class="badge-preview"
              >红色数字角标</span
            >。<br />
            点击回底按钮后未读清零，状态恢复 <code>AT_BOTTOM</code>。
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
        <!-- 自定义回底按钮（带未读角标） -->
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
                  ? `${context.unreadCount > 99 ? '99+' : context.unreadCount} 条新消息`
                  : '回到底部'
              }}
            </span>
            <span v-if="context.unreadCount > 0" class="custom-back-btn__badge">
              {{ context.unreadCount > 99 ? '99+' : context.unreadCount }}
            </span>
          </div>
        </template>
      </BubbleList>
    </div>

    <!-- ====== 状态栏 ====== -->
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
        <span class="status-label">按钮模式</span>
        <el-tag :type="useCustomSlot ? 'warning' : 'info'" size="small">
          {{ useCustomSlot ? '自定义插槽' : '内置默认' }}
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

// ---- 控制面板 ----
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

  // 行为说明卡片
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

  // V2 自定义提示
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

// ---- 状态栏 ----
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
