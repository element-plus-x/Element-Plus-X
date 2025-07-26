<docs>
---
title: Custom Scroll Buttons
---

Override default left and right scroll button styles and interactions.
</docs>

<script setup lang="ts">
import type { FilesCardProps } from 'vue-element-plus-x/types/FilesCard';
import { ref } from 'vue';

type SelfFilesCardProps = FilesCardProps & {
  id?: number;
};

const files = ref<SelfFilesCardProps[]>([]);

function handleBeforUpload(file: any) {
  console.log('before', file);
  if (file.size > 1024 * 1024 * 2) {
    ElMessage.error('File size cannot exceed 2MB!');
    return false;
  }
}

async function handleUploadDrop(files: any, props: any) {
  console.log('drop', files);
  console.log('props', props);

  if (files && files.length > 0) {
    if (files[0].type === '') {
      ElMessage.error('Folder upload is not allowed!');
      return false;
    }

    for (let index = 0; index < files.length; index++) {
      const file = files[index];
      await handleHttpRequest({ file });
    }
  }
}

async function handleHttpRequest(options: any) {
  const formData = new FormData();
  formData.append('file', options.file);
  ElMessage.info('Uploading...');

  setTimeout(() => {
    const res = {
      message: 'File upload successful',
      fileName: options.file.name,
      uid: options.file.uid,
      fileSize: options.file.size,
      imgFile: options.file
    };
    files.value.push({
      id: files.value.length,
      uid: res.uid,
      name: res.fileName,
      fileSize: res.fileSize,
      imgFile: res.imgFile,
      showDelIcon: true,
      imgVariant: 'square'
    });
    ElMessage.success('Upload successful');
  }, 1000);
}

function handleDeleteCard(item: SelfFilesCardProps) {
  files.value = files.value.filter((items: any) => items.id !== item.id);
  console.log('delete', item);
  ElMessage.success('Delete successful');
}
</script>

<template>
  <div style="display: flex; flex-direction: column; gap: 12px">
    <Attachments
      :http-request="handleHttpRequest"
      :items="files"
      drag
      overflow="scrollX"
      :before-upload="handleBeforUpload"
      :hide-upload="false"
      @upload-drop="handleUploadDrop"
      @delete-card="handleDeleteCard"
    >
      <template #prev-button="{ show, onScrollLeft }">
        <button v-if="show" class="custom-prev" @click="onScrollLeft">
          👈
        </button>
      </template>
      <template #next-button="{ show, onScrollRight }">
        <button v-if="show" class="custom-next" @click="onScrollRight">
          👉
        </button>
      </template>
    </Attachments>
  </div>
</template>

<style scoped lang="less">
.custom-prev,
.custom-next {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 10;
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
</style>
