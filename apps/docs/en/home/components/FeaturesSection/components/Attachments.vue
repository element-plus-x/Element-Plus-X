<!-- 欢迎组件首页演示 -->
<script setup lang="ts">
import type {
  FilesCardProps,
  FilesType
} from 'vue-element-plus-x/types/FilesCard';
import { ArrowLeftBold, ArrowRightBold } from '@element-plus/icons-vue';
import { onMounted, ref } from 'vue';
import { Attachments } from 'vue-element-plus-x';

type SelfFilesCardProps = FilesCardProps & {
  id?: number;
};

const colorMap: Record<FilesType, string> = {
  word: '#5E74A8',
  excel: '#4A6B4A',
  ppt: '#C27C40',
  pdf: '#5A6976',
  txt: '#D4C58C',
  mark: '#FFA500',
  image: '#8E7CC3',
  audio: '#A67B5B',
  video: '#4A5568',
  three: '#5F9E86',
  code: '#4B636E',
  database: '#4A5A6B',
  link: '#5D7CBA',
  zip: '#8B5E3C',
  file: '#AAB2BF',
  unknown: '#888888'
};

const files = ref<SelfFilesCardProps[]>([]);
const typeList = Object.keys(colorMap);

onMounted(() => {
  for (let index = 0; index < 8; index++) {
    files.value.push({
      id: index,
      uid: index,
      name: `文件${index}`,
      fileSize: 1024 * 2,
      fileType: typeList[
        Math.floor(Math.random() * typeList.length)
      ] as FilesType,
      // description: `描述 ${index}`,
      url: 'https://element-plus-x.com/logo.png',
      thumbUrl: 'https://element-plus-x.com/logo.png',
      imgFile: new File([], 'test.txt'),
      showDelIcon: false
    });
  }
});
</script>

<template>
  <Attachments :items="files" overflow="scrollX" :hide-upload="true">
    <template #prev-button="{ show, onScrollLeft }">
      <div v-if="show" class="custom-prev" @click="onScrollLeft">
        <el-icon><ArrowLeftBold /></el-icon>
      </div>
    </template>
    <template #next-button="{ show, onScrollRight }">
      <div v-if="show" class="custom-next" @click="onScrollRight">
        <el-icon><ArrowRightBold /></el-icon>
      </div>
    </template>
  </Attachments>
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

  :deep(.elx-files-card) {
    border-radius: 15px;
    background: linear-gradient(
      97deg,
      rgba(90, 196, 255, 0.12) 0%,
      rgba(174, 136, 255, 0.12) 100%
    );

    .elx-files-card-name-prefix {
      overflow: initial;
      /* 设置字体大小和粗细 */
      font-size: 1.25em;
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

    .elx-files-card-description {
      font-size: 0.875rem;
      /* 文字本身的纯色 */
      color: rgba(0, 255, 255);
    }
  }

  :deep(.elx-attachments-background-start) {
    background: transparent;
  }

  :deep(.elx-attachments-background-end) {
    background: transparent;
  }

  .custom-prev,
  .custom-next {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    z-index: 10;
    background-color: rgba(0, 0, 0, 0.5);
    color: white;
    padding: 2px 0px;
    border-radius: 4px;
    font-size: 14px;
    transition: all 0.3s ease;
  }

  .custom-prev {
    left: 8px;
  }

  .custom-next {
    right: 8px;
  }

  .custom-prev:hover,
  .custom-next:hover {
    background-color: rgba(0, 0, 0, 0.8);
    color: white;
    cursor: pointer;
  }

  :deep(.el-button) {
    &:hover {
      background-color: transparent;
    }
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
