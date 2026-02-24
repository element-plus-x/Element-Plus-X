<script lang="ts" setup>
import FilesCard from '@components/FilesCard/index.vue';
import { Pear } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
</script>

<template>
  <div class="component-container">
    <div class="component-title">自定义样式</div>

    <FilesCard v-bind="$attrs" />

    <div class="component-title">
      自定义 icon 插槽，可以通过 #icon="{ item }" 获取文件组件信息
    </div>

    <FilesCard v-bind="$attrs">
      <template #icon>
        <el-icon><Pear /></el-icon>
      </template>
    </FilesCard>

    <div class="component-title">
      自定义内容，content 插槽：会覆盖原有右侧内容，同时通过 #content="{ item }"
      获取当前文件组件信息
    </div>

    <FilesCard v-bind="$attrs">
      <template #content="{ item }">
        <div class="custom-card">
          <div class="custom-card-title">{{ item.name }} -- 自定义内容</div>
          <div class="custom-card-content">文件大小：{{ item.fileSize }}</div>
        </div>
      </template>
    </FilesCard>

    <div class="component-title">
      自定义图片遮罩操作，image-preview-actions 插槽：图片遮罩层自定义，同时通过
      #image-preview-actions="{ item }" 获取当前文件组件信息
    </div>

    <FilesCard
      v-bind="$attrs"
      file-type="image"
      url="https://avatars.githubusercontent.com/u/76239030?s=70&v=4"
      :img-preview="true"
    >
      <template #image-preview-actions>
        <div
          class="image-preview-actions"
          @click="() => ElMessage.success('自定义遮罩操作')"
        >
          自定义遮罩操作
        </div>
      </template>
    </FilesCard>

    <div class="component-title">
      自定义文件名字前缀，name-prefix 插槽：自定义文件名字前缀，同时通过
      #name-prefix="{ item }" 获取当前文件组件信息
    </div>

    <FilesCard v-bind="$attrs">
      <template #name-prefix="{ item }"> 原文件名：{{ item.prefix }} </template>
    </FilesCard>

    <div class="component-title">
      自定义文件名字前缀，name-prefix 插槽：自定义文件名字前缀，同时通过
      #name-prefix="{ item }" 获取当前文件组件信息
    </div>

    <FilesCard v-bind="$attrs">
      <template #name-prefix> 🤳 </template>
    </FilesCard>

    <div class="component-title">
      自定义文件名字后缀，name-suffix 插槽：自定义文件名字后缀，同时通过
      #name-suffix="{ item }" 获取当前文件组件信息
    </div>

    <FilesCard v-bind="$attrs">
      <template #name-suffix> 🤳 </template>
    </FilesCard>

    <div class="component-title">
      自定义删除按钮，del-icon 插槽：自定义文件名字后缀，同时通过 #del-icon="{
      item }" 获取当前文件组件信息
    </div>

    <FilesCard v-bind="$attrs">
      <template #del-icon> 🙅 </template>
    </FilesCard>
  </div>
</template>

<style scoped lang="scss">
.component-container {
  border: 0 !important;
  padding: 12px !important;
  border-radius: 15px !important;
  overflow: auto !important;

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

  .image-preview-actions {
    font-size: 14px;
    position: absolute;
    display: flex;
    flex-direction: column;
    justify-content: center;
    text-align: center;
    cursor: pointer;
    top: 0;
    height: 100%;
    z-index: 9999;
    background-color: aqua;
  }
}
</style>
