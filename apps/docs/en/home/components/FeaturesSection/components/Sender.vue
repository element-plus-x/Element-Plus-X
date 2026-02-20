<!-- 欢迎组件首页演示 -->
<script setup lang="ts">
import { ElementPlus, Promotion } from '@element-plus/icons-vue';
import { XSender } from 'vue-element-plus-x';

const senderValue = ref('你好，我是Element Plus X');
const isSelect = ref(false);
</script>

<template>
  <XSender
    v-model="senderValue"
    variant="updown"
    :input-style="{
      background: 'linear-gradient(45deg, #ff00ff, #00ffff, #ffff00)',
      color: 'transparent',
      fontSize: '1.25em',
      fontWeight: 'bold',
      textShadow: `0 0 10px rgba(255, 255, 255, 0.8), 0 0 20px rgba(255, 0, 255, 0.6), 0 0 30px rgba(0, 255, 255, 0.4)`,
      'background-clip': 'text',
      '-webkit-background-clip': 'text',
      'background-size': `300% 300%`
    }"
    style="
      background: linear-gradient(
        97deg,
        rgba(90, 196, 255, 0.12) 0%,
        rgba(174, 136, 255, 0.12) 100%
      );
      border-radius: 15px;
    "
    :auto-size="{
      minRows: 3,
      maxRows: 5
    }"
  >
    <template #prefix>
      <div
        style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap"
      >
        <div
          :class="{ isSelect }"
          style="
            display: flex;
            align-items: center;
            gap: 4px;
            padding: 2px 12px;
            border: 1px solid rgba(0, 255, 255);
            border-radius: 15px;
            cursor: pointer;
            font-size: 12px;
            color: rgba(0, 255, 255);
          "
          @click="isSelect = !isSelect"
        >
          <el-icon>
            <ElementPlus />
          </el-icon>
          <span>深度思考</span>
        </div>
      </div>
    </template>

    <template #action-list>
      <div style="display: flex; align-items: center; gap: 8px">
        <el-button round color="#626aef">
          <el-icon>
            <Promotion />
          </el-icon>
        </el-button>
      </div>
    </template>
  </XSender>
</template>

<style scoped lang="less">
.card-content-component {
  align-self: center;
  width: calc(100% - 80px);
  margin: 0 40px;
  border-radius: 15px;
  // 旋转45度
  // transform: rotate(5deg);
  /* 彩色阴影：多层不同颜色叠加 */
  // transform: rotate(5deg);
  box-shadow:
    0 0 15px rgba(0, 255, 255, 0.5),
    /* 青色 */ 0 0 20px rgba(138, 43, 226, 0.4),
    /* 蓝紫 */ 0 0 30px rgba(0, 191, 255, 0.3);
  overflow: hidden;

  :deep(.el-x-sender) {
    border: none;
  }

  :deep(.el-textarea__inner) {
    /* 添加动画效果使渐变流动 */
    padding: 8px !important;
    animation: gradientShift 5s ease infinite;
  }

  /* 渐变动画 */
  @keyframes gradientShift {
    0% {
      background-position: 0% 50%;
    }

    50% {
      background-position: 100% 50%;
    }

    100% {
      background-position: 0% 50%;
    }
  }
}
</style>
