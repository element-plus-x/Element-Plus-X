<docs>
---
title: 头部插槽
---

通过 `#header` 插槽用于自定义输入框的头部内容，还可以通过 `headerAnimationTimer` 属性设置头部动画时间。
</docs>

<script setup lang="ts">
import { CircleClose } from '@element-plus/icons-vue';

const showHeaderFlog = ref(true);
</script>

<template>
  <XSender :header-animation-timer="300">
    <!-- 自定义 头部插槽 -->
    <template v-if="showHeaderFlog" #header>
      <div class="header-self-wrap">
        <div class="header-self-title">
          <div class="header-left">💯 欢迎使用 Element Plus X</div>
          <div class="header-right">
            <el-button @click.stop="showHeaderFlog = false">
              <el-icon><CircleClose /></el-icon>
              <span>关闭头部</span>
            </el-button>
          </div>
        </div>
        <div class="header-self-content">🦜 自定义头部内容</div>
      </div>
    </template>
    <!-- 自定义 前缀插槽 -->
    <template #prefix>
      <el-button @click="showHeaderFlog = !showHeaderFlog">
        打开/关闭头部
      </el-button>
    </template>
  </XSender>
</template>

<style scoped lang="less">
.header-self-wrap {
  display: flex;
  flex-direction: column;
  padding: 16px;
  height: 200px;
  .header-self-title {
    width: 100%;
    display: flex;
    height: 30px;
    align-items: center;
    justify-content: space-between;
    padding-bottom: 8px;
  }
  .header-self-content {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    color: #626aef;
    font-weight: 600;
  }
}
</style>
