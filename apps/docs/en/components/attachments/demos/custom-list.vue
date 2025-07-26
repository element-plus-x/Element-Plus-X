<docs>
---
title: Custom File List
---

Customize file list display content through slots (overrides default `FilesCard` component).
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
      :before-upload="handleBeforUpload"
      :hide-upload="false"
      @upload-drop="handleUploadDrop"
      @delete-card="handleDeleteCard"
    >
      <template #file-list="{ items }">
        <div class="custom-list">
          <div v-for="(item, index) in items" :key="index" class="custom-item">
            <div class="custom-item-name">
              {{ item.name }}
            </div>
          </div>
        </div>
      </template>
    </Attachments>
  </div>
</template>

<style scoped lang="less">
.custom-list {
  display: flex;
  gap: 12px;
}

.custom-item {
  padding: 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
}
</style>
