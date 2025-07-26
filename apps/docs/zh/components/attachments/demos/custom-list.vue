<docs>
---
title: 自定义文件列表
---

通过插槽自定义文件列表展示内容（覆盖默认的 `FilesCard` 组件）。
</docs>

<script setup lang="ts">
import type { FilesCardProps } from 'vue-element-plus-x/types/FilesCard';
import { ref } from 'vue';

type SelfFilesCardProps = FilesCardProps & {
  id?: number;
};

const files = ref<SelfFilesCardProps[]>([]);

function handleBeforUpload(file: any) {
  console.log('befor', file);
  if (file.size > 1024 * 1024 * 2) {
    ElMessage.error('文件大小不能超过 2MB!');
    return false;
  }
}

async function handleUploadDrop(files: any, props: any) {
  console.log('drop', files);
  console.log('props', props);

  if (files && files.length > 0) {
    if (files[0].type === '') {
      ElMessage.error('禁止上传文件夹！');
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
  ElMessage.info('上传中...');

  setTimeout(() => {
    const res = {
      message: '文件上传成功',
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
    ElMessage.success('上传成功');
  }, 1000);
}

function handleDeleteCard(item: SelfFilesCardProps) {
  files.value = files.value.filter((items: any) => items.id !== item.id);
  console.log('delete', item);
  ElMessage.success('删除成功');
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
