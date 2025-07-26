<docs>
---
title: 黏贴文件
---

使用 `pasteFile` 获取黏贴的文件，配合 `Attachments` 进行文件上传展示。
</docs>

<script setup lang="ts">
import type { FilesCardProps } from 'vue-element-plus-x/types/FilesCard';
import { CloseBold, Link } from '@element-plus/icons-vue';

const senderRef = ref();
const senderValue = ref('');
const showHeaderFlog = ref(false);

type SelfFilesCardProps = FilesCardProps & {
  id?: number | string;
};

const files = ref<SelfFilesCardProps[]>([]);

function handleOpenHeader() {
  if (!showHeaderFlog.value) {
    senderRef.value.openHeader();
  }
  else {
    senderRef.value.closeHeader();
  }
  showHeaderFlog.value = !showHeaderFlog.value;
}

function closeHeader() {
  showHeaderFlog.value = false;
  senderRef.value.closeHeader();
}

function handlePasteFile(firstFile: File, fileList: FileList) {
  showHeaderFlog.value = true;
  senderRef.value.openHeader();
  const fileArray = Array.from(fileList);

  fileArray.forEach((file, index) => {
    files.value.push({
      id: index,
      uid: index + '_' + file.name + '_' + file.size,
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
  ElMessage.success('删除成功');
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
    <Sender ref="senderRef" v-model="senderValue" @paste-file="handlePasteFile">
      <template #header>
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

      <!-- 自定义前缀 -->
      <template #prefix>
        <div class="prefix-self-wrap">
          <el-button @click="handleOpenHeader">
            <el-icon><Link /></el-icon>
          </el-button>
        </div>
      </template>
    </Sender>
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
