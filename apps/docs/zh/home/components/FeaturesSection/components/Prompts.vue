<!-- 欢迎组件首页演示 -->
<script setup lang="ts">
import type { PromptsItemsProps } from 'vue-element-plus-x/types/Prompts';
import { ref } from 'vue';
import { Prompts } from 'vue-element-plus-x';

const items = ref<PromptsItemsProps[]>([
  {
    key: '1',
    label: '你好, 我是 Element Plus X',
    description: '这里用于显示一组与当前上下文相关的预定义的问题或建议。',
    children: [
      {
        key: '1-1',
        description: 'vue 真的移除了虚拟 dom 嘛？'
      },
      {
        key: '1-2',
        description: '如何在项目中引入 Element-Plus-X？'
      }
    ]
  }
]);
</script>

<template>
  <Prompts :items="items" vertical />
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

  :deep(.el-prompts-items) {
    border-radius: inherit;
    width: 100%;
    border: none;
    background: transparent !important;
  }

  :deep(.el-prompts-item) {
    border-radius: 15px;
    width: 100%;
    border: none;
    background: linear-gradient(
      97deg,
      rgba(90, 196, 255, 0.12) 0%,
      rgba(174, 136, 255, 0.12) 100%
    );
  }

  :deep(.el-prompts-item-description) {
    margin-bottom: 4px !important;
  }

  :deep(.el-prompts-item) {
    .el-prompts-item-label {
      /* 设置字体大小和粗细 */
      font-size: 1.05em;
      font-weight: bold;

      /* 设置渐变背景 */
      background: linear-gradient(45deg, #ff00ff, #00ffff, #ffff00);
      background-size: 300% 300%;

      /* 将背景裁剪为文本形状 */
      -webkit-background-clip: text;
      background-clip: text;

      /* 使文本本身透明，显示背景渐变 */
      color: transparent;

      /* 添加光辉效果 */
      text-shadow:
        0 0 10px rgba(255, 255, 255, 0.8),
        0 0 20px rgba(255, 0, 255, 0.6),
        0 0 30px rgba(0, 255, 255, 0.4);

      /* 添加动画效果使渐变流动 */
      animation: gradientShift 5s ease infinite;
    }

    .el-prompts-item-description {
      font-size: 0.875rem;
      color: rgba(0, 255, 255);
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
}
</style>
