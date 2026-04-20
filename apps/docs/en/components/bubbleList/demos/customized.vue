<docs>
---
title: Slot Customization
---

Fully take over list rendering with 9 slots: `#avatar`, `#header`, `#content`, `#footer`, `#loading` control each bubble's parts; `#backToBottom` customizes the back-to-bottom button (with unread badge); `#topStatus` / `#bottomStatus` customize boundary status areas; `#item` renders non-bubble type nodes.
</docs>

<script setup lang="ts">
import type {
  BubbleListBoundaryState,
  BubbleListItemProps,
  BubbleListProps
} from 'vue-element-plus-x/types/BubbleList';
import {
  ArrowDown,
  Bell,
  Bottom,
  DocumentCopy,
  Refresh,
  Search,
  Star,
  Top
} from '@element-plus/icons-vue';

type listType = BubbleListItemProps & {
  key: number;
  role: 'user' | 'ai' | 'system';
};

// Example call
const bubbleItems = ref<BubbleListProps<listType>['list']>(
  generateFakeItems(16)
);
const avatar = ref('https://avatars.githubusercontent.com/u/76239030?v=4');
const avartAi = ref(
  'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png'
);
const switchValue = ref(false);
const loading = ref(false);

// Boundary state (for topStatus / bottomStatus slots)
const topStatus = ref<BubbleListBoundaryState | null>(null);
const bottomStatus = ref<BubbleListBoundaryState | null>(null);

function generateFakeItems(count: number): listType[] {
  const messages: listType[] = [];
  for (let i = 0; i < count; i++) {
    const role = i % 2 === 0 ? 'ai' : 'user';
    const placement = role === 'ai' ? 'start' : 'end';
    const key = i + 1;
    messages.push({
      key,
      role,
      placement,
      noStyle: true // If you don't want to use default bubble styles
    });
  }
  return messages;
}

// Set loading for a specific item
function setLoading(loading: boolean) {
  bubbleItems.value[bubbleItems.value.length - 1].loading = loading;
  bubbleItems.value[bubbleItems.value.length - 2].loading = loading;
}

/** Insert a system notice (rendered via #item slot) */
function addNotice() {
  bubbleItems.value.push({
    key: bubbleItems.value.length + 1,
    role: 'system',
    placement: 'start',
    type: 'notice'
  } as listType);
}

/** Simulate top load more */
function triggerTopLoad() {
  topStatus.value = { type: 'loading', text: 'Loading earlier messages...' };
  setTimeout(() => {
    bubbleItems.value.unshift(
      { key: Date.now(), role: 'ai', placement: 'start', noStyle: true },
      { key: Date.now() + 1, role: 'user', placement: 'end', noStyle: true }
    );
    topStatus.value = null;
  }, 1500);
}

/** Simulate bottom load more */
function triggerBottomLoad() {
  bottomStatus.value = { type: 'loading', text: 'Loading more messages...' };
  setTimeout(() => {
    bubbleItems.value.push({
      key: Date.now(),
      role: 'ai',
      placement: 'start',
      noStyle: true
    });
    bottomStatus.value = null;
  }, 1500);
}
</script>

<template>
  <div style="display: flex; flex-direction: column; gap: 12px">
    <!-- Control area -->
    <div style="display: flex; flex-wrap: wrap; gap: 12px; align-items: center">
      <span>Dynamic content setting <el-switch v-model="switchValue" /></span>
      <span
        >Custom loading
        <el-switch
          v-model="loading"
          @change="(value: any) => setLoading(value as boolean)"
        />
      </span>
    </div>

    <div style="display: flex; flex-wrap: wrap; gap: 12px; align-items: center">
      <el-button type="primary" @click="addNotice">
        + System Notice (#item)
      </el-button>
      <el-button type="primary" :icon="Top" @click="triggerTopLoad">
        Top Load
      </el-button>
      <el-button type="primary" :icon="Bottom" @click="triggerBottomLoad">
        Bottom Load
      </el-button>
      <el-button @click="() => bubbleItems.unshift(...generateFakeItems(3))">
        +3 Messages (observe back-to-bottom button)
      </el-button>
    </div>

    <div class="story-stage">
      <BubbleList
        :list="bubbleItems"
        :top-status="topStatus"
        :bottom-status="bottomStatus"
        show-back-button
      >
        <!-- ====== 1. #avatar Custom avatar ====== -->
        <template #avatar="{ item }">
          <div class="avatar-wrapper">
            <img :src="item.role === 'ai' ? avartAi : avatar" alt="avatar" />
          </div>
        </template>

        <!-- ====== 2. #header Custom header ====== -->
        <template #header="{ item }">
          <div class="header-wrapper">
            <div class="header-name">
              {{ item.role === 'ai' ? 'Element Plus X 🍧' : '🧁 User' }}
            </div>
          </div>
        </template>

        <!-- ====== 3. #content Custom bubble content ====== -->
        <template #content="{ item }">
          <div class="content-wrapper">
            <div class="content-text">
              {{
                item.role === 'ai'
                  ? `${switchValue ? `#ai-${item.key}：` : ''} 💖 Thank you for using Element Plus X ! Your support is our strongest motivation for open source ~`
                  : `${switchValue ? `#user-${item.key}：` : ''}Hahaha, let me try`
              }}
            </div>
          </div>
        </template>

        <!-- ====== 4. #footer Custom footer action bar ====== -->
        <template #footer="{ item }">
          <div class="footer-wrapper">
            <div class="footer-container">
              <el-button type="info" :icon="Refresh" size="small" circle />
              <el-button type="success" :icon="Search" size="small" circle />
              <el-button type="warning" :icon="Star" size="small" circle />
              <el-button
                color="#626aef"
                :icon="DocumentCopy"
                size="small"
                circle
              />
            </div>
            <div class="footer-time">
              {{ item.role === 'ai' ? '2:32 PM' : '2:33 PM' }}
            </div>
          </div>
        </template>

        <!-- ====== 5. #loading Custom loading animation ====== -->
        <template #loading="{ item }">
          <div class="loading-container">
            <span>#{{ item.role }}-{{ item.key }}：</span>
            <span>I</span>
            <span>am</span>
            <span>custom</span>
            <span>loading</span>
            <span>content</span>
            <span>oh</span>
            <span>~</span>
          </div>
        </template>

        <!-- ====== 6. #backToBottom Custom back-to-bottom button (with unread badge) ====== -->
        <template #backToBottom="{ unreadCount: uc, scrollToBottom }">
          <div class="custom-back-btn" @click="scrollToBottom(false)">
            <el-icon :size="14">
              <ArrowDown />
            </el-icon>
            <span>{{ uc > 0 ? `${uc} new messages` : 'Back to bottom' }}</span>
            <span v-if="uc > 0" class="unread-badge">{{
              uc > 99 ? '99+' : uc
            }}</span>
          </div>
        </template>

        <!-- ====== 7. #topStatus Custom top boundary status ====== -->
        <template #topStatus="{ status }">
          <div class="boundary-custom boundary-top">
            <el-icon
              v-if="status.type === 'loading'"
              class="is-loading"
              :size="14"
            >
              <Refresh />
            </el-icon>
            <span>{{ status.text || `Top ${status.type}` }}</span>
            <el-tag size="small" type="info" effect="plain">
              #topStatus
            </el-tag>
          </div>
        </template>

        <!-- ====== 8. #bottomStatus Custom bottom boundary status ====== -->
        <template #bottomStatus="{ status }">
          <div class="boundary-custom boundary-bottom">
            <el-icon
              v-if="status.type === 'loading'"
              class="is-loading"
              :size="14"
            >
              <Refresh />
            </el-icon>
            <span>{{ status.text || `Bottom ${status.type}` }}</span>
            <el-tag size="small" type="info" effect="plain">
              #bottomStatus
            </el-tag>
          </div>
        </template>

        <!-- ====== 9. #item Non-bubble custom rendering ====== -->
        <template #item="{ index, itemType }">
          <div class="custom-notice-item">
            <el-icon :size="16" color="#e6a23c">
              <Bell />
            </el-icon>
            <span
              >[{{ itemType }}] System Notice — This is custom rendered content
              via #item slot (index={{ index }})</span
            >
          </div>
        </template>
      </BubbleList>
    </div>
  </div>
</template>

<style scoped lang="less">
.story-stage {
  height: 450px;
  padding: 8px 10px;
  border-radius: 16px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  overflow: hidden;
}

/* ── 1. avatar ── */
.avatar-wrapper {
  width: 40px;
  height: 40px;
  img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
  }
}

/* ── 2. header ── */
.header-wrapper {
  .header-name {
    font-size: 14px;
    color: #979797;
  }
}

/* ── 3. content ── */
.content-wrapper {
  .content-text {
    font-size: 14px;
    color: #333;
    padding: 12px;
    background: linear-gradient(to right, #fdfcfb 0%, #ffd1ab 100%);
    border-radius: 15px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
}

/* ── 4. footer ── */
.footer-wrapper {
  display: flex;
  align-items: center;
  gap: 10px;
  .footer-time {
    font-size: 12px;
    margin-top: 3px;
  }
}

.footer-container {
  :deep(.el-button + .el-button) {
    margin-left: 8px;
  }
}

/* ── 5. loading ── */
.loading-container {
  font-size: 14px;
  color: #333;
  padding: 12px;
  background: linear-gradient(to right, #fdfcfb 0%, #ffd1ab 100%);
  border-radius: 15px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.loading-container span {
  display: inline-block;
  margin-left: 8px;
}

@keyframes bounce {
  0%,
  100% {
    transform: translateY(5px);
  }
  50% {
    transform: translateY(-5px);
  }
}

.loading-container span:nth-child(4n) {
  animation: bounce 1.2s ease infinite;
}
.loading-container span:nth-child(4n + 1) {
  animation: bounce 1.2s ease infinite;
  animation-delay: 0.3s;
}
.loading-container span:nth-child(4n + 2) {
  animation: bounce 1.2s ease infinite;
  animation-delay: 0.6s;
}
.loading-container span:nth-child(4n + 3) {
  animation: bounce 1.2s ease infinite;
  animation-delay: 0.9s;
}

/* ── 6. backToBottom custom back-to-bottom button ── */
.custom-back-btn {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 6px 14px;
  border-radius: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.4);
  transition: all 0.25s ease;
  user-select: none;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 14px rgba(102, 126, 234, 0.55);
  }
}

.unread-badge {
  position: absolute;
  top: -5px;
  right: -5px;
  min-width: 16px;
  height: 16px;
  padding: 0 4px;
  border-radius: 8px;
  background: #f56c6c;
  color: #fff;
  font-size: 10px;
  font-weight: 700;
  line-height: 16px;
  text-align: center;
  animation: badge-pulse 1.5s ease-in-out infinite;
}

@keyframes badge-pulse {
  0%,
  100% {
    box-shadow: 0 0 0 0 rgba(245, 108, 108, 0.55);
  }
  50% {
    box-shadow: 0 0 0 5px rgba(245, 108, 108, 0);
  }
}

/* ── 7 & 8. topStatus / bottomStatus ── */
.boundary-custom {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 12px;
  color: #606266;

  &.boundary-top {
    background: linear-gradient(90deg, #ecf5ff 0%, transparent 100%);
    border: 1px dashed #b3d8ff;
  }

  &.boundary-bottom {
    background: linear-gradient(90deg, transparent 0%, #ecf5ff 100%);
    border: 1px dashed #b3d8ff;
  }

  .el-icon {
    color: #409eff;
  }
}

/* ── 9. item non-bubble custom item ── */
.custom-notice-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 14px;
  margin: 4px 0;
  border-radius: 8px;
  background: linear-gradient(90deg, #fdf6ec 0%, #faecd8 100%);
  border-left: 3px solid #e6a23c;
  font-size: 13px;
  color: #996633;
}
</style>
