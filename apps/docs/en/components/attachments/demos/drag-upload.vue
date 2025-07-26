<docs>
---
title: Drag and Drop Upload
---

The `drag` property enables drag and drop upload functionality, supporting custom drag target areas and visual feedback.

The `dragTarget` property can be an id selector string, a Ref instance, or an HTMLElement DOM. If not set, the default drag area is the current list.

If you want to enable drag upload for the entire page, set `drag` to `true` and set `drag-target` to `'document.body'`.
</docs>

<script setup lang="ts">
import type { FilesCardProps } from 'vue-element-plus-x/types/FilesCard';

type SelfFilesCardProps = FilesCardProps & {
  id?: number;
};

const files = ref<SelfFilesCardProps[]>([]);
const isFull = ref(false);

const dragArea = ref();

watch(
  () => isFull.value,
  () => {
    console.log('isFull.value', isFull.value);

    if (isFull.value) {
      dragArea.value = document.body;
    } else {
      dragArea.value = 'drag-area';
    }
  },
  { immediate: true, deep: true }
);

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
    <p>Set fullscreen drag upload: <el-switch v-model="isFull" /></p>
    <Attachments
      :http-request="handleHttpRequest"
      :items="files"
      drag
      :drag-target="dragArea"
      :before-upload="handleBeforUpload"
      :hide-upload="false"
      @upload-drop="handleUploadDrop"
      @delete-card="handleDeleteCard"
    />

    <div
      id="drag-area"
      style="
        border: 2px dashed #ccc;
        padding: 20px;
        height: 250px;
        text-align: center;
        display: flex;
        align-items: center;
        justify-content: center;
      "
    >
      Drag files here to upload
    </div>
  </div>
</template>

<style scoped lang="less"></style>
