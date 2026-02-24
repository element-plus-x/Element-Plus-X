<script setup lang="ts">
import type { AttachmentsProps } from '@components/Attachments/types';
import Attachments from '@components/Attachments/index.vue';
import { useAttachmentStubs } from './useAttachmentStubs';

type Props = Pick<AttachmentsProps, 'items'>;
const props = withDefaults(defineProps<Props>(), {
  items: () => []
});

const {
  files,
  handleBeforeUpload,
  handleHttpRequest,
  handleUploadDrop,
  handleDeleteCard
} = useAttachmentStubs(props.items);
</script>

<template>
  <div class="component-container">
    <div class="component-title">附件上传组件-自定义左右按钮、列表内容</div>
    <Attachments
      v-bind="{ ...$attrs }"
      :items="files"
      :http-request="handleHttpRequest"
      :before-upload="handleBeforeUpload"
      @upload-drop="handleUploadDrop"
      @delete-card="handleDeleteCard"
    >
      <template #file-list="{ items }">
        <div
          class="custom-list"
          :class="{
            'custom-list-overflow-no-x': $attrs.overflow !== 'scrollX'
          }"
        >
          <div v-for="(item, idx) in items" :key="idx" class="custom-item">
            <div class="custom-item-name">
              {{ item.name }}
            </div>
          </div>
        </div>
      </template>

      <!-- 自定义左侧按钮（覆盖默认插槽） -->
      <template #prev-button="{ show, onScrollLeft }">
        <button v-if="show" class="custom-prev" @click="onScrollLeft">
          👈
        </button>
      </template>

      <!-- 自定义右侧按钮（覆盖默认插槽） -->
      <template #next-button="{ show, onScrollRight }">
        <button v-if="show" class="custom-next" @click="onScrollRight">
          👉
        </button>
      </template>
    </Attachments>
  </div>
</template>

<style scoped lang="scss">
.component-container {
  padding: 12px;
  border-radius: 15px;
  display: flex;
  flex-direction: column;

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
}
/* 用户自定义样式（覆盖默认外观） */
.custom-prev,
.custom-next {
  position: absolute; /* 必须保留定位样式 */
  top: 50%;
  transform: translateY(-50%);
  z-index: 10;

  /* 自定义外观 */
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  border: 2px solid rgba(255, 255, 255, 0.5);
  padding: 8px 16px;
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
  border-color: rgba(255, 255, 255, 0.8);
}

.custom-list {
  display: flex;

  .custom-item {
    margin: 8px;
    width: 200px;
    height: 80px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 8px;
    background-color: antiquewhite;
    flex: none;
  }
}

.custom-item-name {
  padding: 0 12px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.custom-list-overflow-no-x {
  flex-wrap: wrap;
}
</style>
