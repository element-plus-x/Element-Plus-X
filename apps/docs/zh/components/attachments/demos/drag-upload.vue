<docs>
---
title: 拖拽上传
---

`drag` 属性，开启拖拽上传功能，支持自定义拖拽目标区域和视觉反馈。

`dragTarget` 属性 可以是一个 id 选择器字符串，可以是一个 Ref 实例，也可以是 HTMLElement dom 。不设置就默认拖拽范围为当前列表。

如果想整个页面拖拽上传，请将 `drag` 设置为 `true`，并设置 `drag-target` 为 `'document.body'`。
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
    }
    else {
      dragArea.value = 'drag-area';
    }
  },
  { immediate: true, deep: true }
);

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
    <p>设置全屏拖拽上传：<el-switch v-model="isFull" /></p>
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
      在此处拖拽文件上传
    </div>
  </div>
</template>

<style scoped lang="less"></style>
