<docs>
---
title: 插槽自定义
---

通过 9 个插槽完全接管列表渲染：`#avatar`、`#header`、`#content`、`#footer`、`#loading` 控制每条气泡的各部分；`#backToBottom` 自定义回底按钮（含未读角标）；`#topStatus` / `#bottomStatus` 自定义边界状态区；`#item` 渲染非气泡类型节点。
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

// 示例调用
const bubbleItems = ref<BubbleListProps<listType>['list']>(
  generateFakeItems(16)
);
const avatar = ref('https://avatars.githubusercontent.com/u/76239030?v=4');
const avartAi = ref(
  'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png'
);
const switchValue = ref(false);
const loading = ref(false);

// 边界状态（用于 topStatus / bottomStatus 插槽）
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
      noStyle: true // 如果你不想用默认的气泡样式
    });
  }
  return messages;
}

// 设置某个 item 的 loading
function setLoading(loading: boolean) {
  bubbleItems.value[bubbleItems.value.length - 1].loading = loading;
  bubbleItems.value[bubbleItems.value.length - 2].loading = loading;
}

/** 插入一条系统通知（走 #item 插槽） */
function addNotice() {
  bubbleItems.value.push({
    key: bubbleItems.value.length + 1,
    role: 'system',
    placement: 'start',
    type: 'notice'
  } as listType);
}

/** 模拟顶部加载更多 */
function triggerTopLoad() {
  topStatus.value = { type: 'loading', text: '正在加载更早的消息...' };
  setTimeout(() => {
    bubbleItems.value.unshift(
      { key: Date.now(), role: 'ai', placement: 'start', noStyle: true },
      { key: Date.now() + 1, role: 'user', placement: 'end', noStyle: true }
    );
    topStatus.value = null;
  }, 1500);
}

/** 模拟底部加载更多 */
function triggerBottomLoad() {
  bottomStatus.value = { type: 'loading', text: '正在加载更多消息...' };
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
    <!-- 控制区 -->
    <div style="display: flex; flex-wrap: wrap; gap: 12px; align-items: center">
      <span>动态设置内容 <el-switch v-model="switchValue" /></span>
      <span
        >自定义 loading
        <el-switch
          v-model="loading"
          @change="(value: any) => setLoading(value as boolean)"
        />
      </span>
    </div>

    <div style="display: flex; flex-wrap: wrap; gap: 12px; align-items: center">
      <el-button type="primary" @click="addNotice">
        + 系统通知（#item）
      </el-button>
      <el-button type="primary" :icon="Top" @click="triggerTopLoad">
        顶部加载
      </el-button>
      <el-button type="primary" :icon="Bottom" @click="triggerBottomLoad">
        底部加载
      </el-button>
      <el-button @click="() => bubbleItems.unshift(...generateFakeItems(3))">
        +3 条消息（便于观察回底按钮）
      </el-button>
    </div>

    <div class="story-stage">
      <BubbleList
        :list="bubbleItems"
        :top-status="topStatus"
        :bottom-status="bottomStatus"
        show-back-button
      >
        <!-- ====== 1. #avatar 自定义头像 ====== -->
        <template #avatar="{ item }">
          <div class="avatar-wrapper">
            <img :src="item.role === 'ai' ? avartAi : avatar" alt="avatar" />
          </div>
        </template>

        <!-- ====== 2. #header 自定义头部 ====== -->
        <template #header="{ item }">
          <div class="header-wrapper">
            <div class="header-name">
              {{ item.role === 'ai' ? 'Element Plus X 🍧' : '🧁 用户' }}
            </div>
          </div>
        </template>

        <!-- ====== 3. #content 自定义气泡内容 ====== -->
        <template #content="{ item }">
          <div class="content-wrapper">
            <div class="content-text">
              {{
                item.role === 'ai'
                  ? `${switchValue ? `#ai-${item.key}：` : ''} 💖 感谢使用 Element Plus X ! 你的支持，是我们开源的最强动力 ~`
                  : `${switchValue ? `#user-${item.key}：` : ''}哈哈哈，让我试试`
              }}
            </div>
          </div>
        </template>

        <!-- ====== 4. #footer 自定义底部操作栏 ====== -->
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
              {{ item.role === 'ai' ? '下午 2:32' : '下午 2:33' }}
            </div>
          </div>
        </template>

        <!-- ====== 5. #loading 自定义加载动画 ====== -->
        <template #loading="{ item }">
          <div class="loading-container">
            <span>#{{ item.role }}-{{ item.key }}：</span>
            <span>我</span>
            <span>是</span>
            <span>自</span>
            <span>定</span>
            <span>义</span>
            <span>加</span>
            <span>载</span>
            <span>内</span>
            <span>容</span>
            <span>哦</span>
            <span>~</span>
          </div>
        </template>

        <!-- ====== 6. #backToBottom 自定义回底按钮（含未读角标） ====== -->
        <template #backToBottom="{ unreadCount: uc, scrollToBottom }">
          <div class="custom-back-btn" @click="scrollToBottom(false)">
            <el-icon :size="14">
              <ArrowDown />
            </el-icon>
            <span>{{ uc > 0 ? `${uc} 条新消息` : '回到底部' }}</span>
            <span v-if="uc > 0" class="unread-badge">{{
              uc > 99 ? '99+' : uc
            }}</span>
          </div>
        </template>

        <!-- ====== 7. #topStatus 自定义顶部边界状态 ====== -->
        <template #topStatus="{ status }">
          <div class="boundary-custom boundary-top">
            <el-icon
              v-if="status.type === 'loading'"
              class="is-loading"
              :size="14"
            >
              <Refresh />
            </el-icon>
            <span>{{ status.text || `顶部 ${status.type}` }}</span>
            <el-tag size="small" type="info" effect="plain">
              #topStatus
            </el-tag>
          </div>
        </template>

        <!-- ====== 8. #bottomStatus 自定义底部边界状态 ====== -->
        <template #bottomStatus="{ status }">
          <div class="boundary-custom boundary-bottom">
            <el-icon
              v-if="status.type === 'loading'"
              class="is-loading"
              :size="14"
            >
              <Refresh />
            </el-icon>
            <span>{{ status.text || `底部 ${status.type}` }}</span>
            <el-tag size="small" type="info" effect="plain">
              #bottomStatus
            </el-tag>
          </div>
        </template>

        <!-- ====== 9. #item 非气泡类型自定义渲染 ====== -->
        <template #item="{ index, itemType }">
          <div class="custom-notice-item">
            <el-icon :size="16" color="#e6a23c">
              <Bell />
            </el-icon>
            <span
              >[{{ itemType }}] 系统通知 — 这是通过 #item
              插槽自定义渲染的内容（index={{ index }}）</span
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

/* ── 6. backToBottom 自定义回底按钮 ── */
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

/* ── 9. item 非气泡自定义项 ── */
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
