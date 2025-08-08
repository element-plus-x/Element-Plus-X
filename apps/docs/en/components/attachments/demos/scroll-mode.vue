<docs>
---
title: Scroll Mode
---

Supports three layout modes: horizontal scroll (`scrollX`), vertical scroll (`scrollY`), and auto wrap (`wrap`). Default is horizontal scroll.
</docs>

<script setup lang="ts">
import type {
  FilesCardProps,
  FilesType
} from 'vue-element-plus-x/types/FilesCard';
import { ref } from 'vue';

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
  for (let index = 0; index < 30; index++) {
    files.value.push({
      id: index,
      uid: index,
      name: `File ${index}`,
      fileSize: 1024 * 2,
      fileType: typeList[
        Math.floor(Math.random() * typeList.length)
      ] as FilesType,
      // description: `Description ${index}`,
      url: 'https://www.baidu.com',
      thumbUrl: 'https://www.baidu.com',
      imgFile: new File([], 'test.txt'),
      showDelIcon: true
    });
  }
});

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
    <div>scrollX</div>
    <Attachments
      :http-request="handleHttpRequest"
      :items="files"
      drag
      overflow="scrollX"
      :before-upload="handleBeforUpload"
      :hide-upload="false"
      @upload-drop="handleUploadDrop"
      @delete-card="handleDeleteCard"
    />
    <div>scrollY</div>
    <Attachments
      :http-request="handleHttpRequest"
      :items="files"
      drag
      overflow="scrollY"
      :list-style="{ height: '200px' }"
      :before-upload="handleBeforUpload"
      :hide-upload="false"
      @upload-drop="handleUploadDrop"
      @delete-card="handleDeleteCard"
    />
    <div>wrap</div>
    <Attachments
      :http-request="handleHttpRequest"
      :items="files"
      drag
      overflow="wrap"
      :before-upload="handleBeforUpload"
      :hide-upload="false"
      @upload-drop="handleUploadDrop"
      @delete-card="handleDeleteCard"
    />
  </div>
</template>

<style scoped lang="less"></style>
