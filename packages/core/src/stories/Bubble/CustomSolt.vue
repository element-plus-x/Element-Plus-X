<script setup lang="ts">
import type { BubbleProps } from '@components/Bubble/types';
import Bubble from '@components/Bubble/index.vue';
import ConfigProvider from '@components/ConfigProvider/index.vue';
import { DocumentCopy, Refresh, Search, Star } from '@element-plus/icons-vue';

const props = defineProps<BubbleProps>();
</script>

<template>
  <ConfigProvider>
    <div class="component-container">
      <div class="component-title">头像插槽</div>
      <Bubble v-bind="{ ...$attrs, ...$props }">
        <template #avatar>
          <img
            src="https://avatars.githubusercontent.com/u/76239030?s=40&v=4"
            class="avatar"
          />
        </template>
      </Bubble>

      <div class="component-title">头部插槽</div>
      <Bubble v-bind="{ ...$attrs, ...props }">
        <template #avatar>
          <img
            src="https://avatars.githubusercontent.com/u/76239030?s=40&v=4"
            class="avatar"
          />
        </template>

        <template #header>
          <div class="header-time">
            {{ new Date().toLocaleString() }}
          </div>
        </template>
      </Bubble>

      <div class="component-title">内容插槽 搭配 noStyle 属性</div>
      <Bubble v-bind="{ ...$attrs, ...props, noStyle: true }">
        <template #avatar>
          <img
            src="https://avatars.githubusercontent.com/u/76239030?s=40&v=4"
            class="avatar"
          />
        </template>

        <template #header>
          <div class="header-time">
            {{ new Date().toLocaleString() }}
          </div>
        </template>

        <template #content>
          <div class="content">
            {{ props.content }}
          </div>
        </template>
      </Bubble>

      <div class="component-title">底部插槽</div>
      <Bubble v-bind="{ ...$attrs, ...props, noStyle: true }">
        <template #avatar>
          <img
            src="https://avatars.githubusercontent.com/u/76239030?s=40&v=4"
            class="avatar"
          />
        </template>

        <template #header>
          <div class="header-time">
            {{ new Date().toLocaleString() }}
          </div>
        </template>

        <template #content>
          <div class="content">
            {{ props.content }}
          </div>
        </template>

        <template #footer>
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
        </template>
      </Bubble>

      <div class="component-title">加载中插槽 loading 为 true 时展示</div>
      <Bubble v-bind="{ ...$attrs, ...props }">
        <template #loading>
          <div class="loading-container">
            <div class="dot1" />
            <div class="dot2" />
            <div class="dot3" />
          </div>
        </template>
      </Bubble>
    </div>
  </ConfigProvider>
</template>

<style scoped lang="scss">
.component-container {
  padding: 12px;
  border-radius: 15px;

  .component-title {
    display: flex;
    align-items: center;
    position: relative;
    padding-left: 12px;
    font-weight: 700;
    line-height: 1.5;
    margin-bottom: 12px;
    margin-top: 24px;

    &::after {
      position: absolute;
      content: '';
      display: block;
      width: 5px;
      height: 75%;
      border-radius: 15px;
      left: 0;
      background-color: #409eff;
    }
  }

  .avatar {
    border-top-right-radius: 10px;
    border-bottom-right-radius: 10px;
    border-bottom-left-radius: 10px;
  }

  .header-time {
    margin-bottom: 4px;
  }

  .content {
    font-size: 14px;
    font-weight: 700;
    color: #333;
    padding: 12px;
    background: linear-gradient(to right, #fdfcfb 0%, #ffd1ab 100%);
    border-radius: 15px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  .footer-container {
    :deep() {
      .el-button + .el-button {
        margin-left: 8px;
      }
    }
  }

  .loading-container {
    display: flex;
    gap: 4px;
    .dot1,
    .dot2,
    .dot3 {
      width: 10px;
      height: 10px;
      border-radius: 50%;
    }

    .dot1 {
      animation: jump 1.6s -0.32s linear infinite;
      background: #626aef;
    }

    .dot2 {
      animation: jump 1.6s -0.16s linear infinite;
      background: #626aef;
    }

    .dot3 {
      animation: jump 1.6s linear infinite;
      background: #626aef;
    }

    @keyframes jump {
      0%,
      80%,
      100% {
        -webkit-transform: scale(0);
        transform: scale(0);
      }

      40% {
        -webkit-transform: scale(0.8);
        transform: scale(0.8);
      }
    }
  }
}
</style>
