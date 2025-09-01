<docs>
---
title: Paste Files
---

Use `pasteFile` to get the pasted files, and use `Attachments` to display the uploaded files.
</docs>

<script setup lang="ts">
import type { FilesCardProps } from 'vue-element-plus-x/types/FilesCard';
import { CloseBold, Link } from '@element-plus/icons-vue';

const showHeaderFlog = ref(false);

type SelfFilesCardProps = FilesCardProps & {
  id?: number | string;
};

const files = ref<SelfFilesCardProps[]>([]);

function handleOpenHeader() {
  showHeaderFlog.value = !showHeaderFlog.value;
}

function closeHeader() {
  showHeaderFlog.value = false;
}

function handlePasteFile(firstFile: File, fileList: FileList) {
  showHeaderFlog.value = true;
  const fileArray = Array.from(fileList);

  fileArray.forEach((file, index) => {
    files.value.push({
      id: index,
      uid: `${index}_${file.name}_${file.size}`,
      name: file.name,
      fileSize: file.size,
      imgFile: file,
      showDelIcon: true,
      imgVariant: 'square'
    });
  });
}

async function handleHttpRequest(options: any) {
  const formData = new FormData();
  formData.append('file', options.file);
  ElMessage.info('Uploading...');

  setTimeout(() => {
    const res = {
      message: 'File uploaded successfully',
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

    ElMessage.success('Uploaded successfully');
  }, 1000);
}

function handleDeleteCard(item: SelfFilesCardProps) {
  files.value = files.value.filter((items: any) => items.id !== item.id);
  ElMessage.success('Deleted successfully');
}
</script>

<template>
  <div
    style="
      display: flex;
      flex-direction: column;
      gap: 12px;
      height: 230px;
      justify-content: flex-end;
    "
  >
    <EditorSender placeholder="Paste files here" :header-animation-timer="300" @paste-file="handlePasteFile">
      <template v-if="showHeaderFlog" #header>
        <div class="header-self-wrap">
          <div class="header-self-title">
            <div class="header-left">
              Attachments
            </div>
            <div class="header-right">
              <el-button @click.stop="closeHeader">
                <el-icon><CloseBold /></el-icon>
              </el-button>
            </div>
          </div>
          <Attachments
            :items="files"
            :http-request="handleHttpRequest"
            @delete-card="handleDeleteCard"
          />
        </div>
      </template>

      <template #prefix>
        <div class="prefix-self-wrap">
          <el-button @click="handleOpenHeader">
            <el-icon><Link /></el-icon>
          </el-button>
        </div>
      </template>
    </EditorSender>
  </div>
</template>

<style scoped lang="less">
.header-self-wrap {
  display: flex;
  flex-direction: column;
  padding: 16px;
  height: 200px;
  .header-self-title {
    width: 100%;
    display: flex;
    height: 30px;
    align-items: center;
    justify-content: space-between;
    padding-bottom: 8px;
  }
  .header-self-content {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    color: #626aef;
    font-weight: 600;
  }
}

.prefix-self-wrap {
  display: flex;
}
</style>
