<script lang="ts" setup>
import { FilesCard } from '../../components';
</script>

<template>
  <div class="component-container">
    <div class="component-title">文件卡片</div>
    <FilesCard v-bind="$attrs" />
    <br />
    <FilesCard
      v-bind="$attrs"
      name="FilesCardDemo.png"
      file-type="image"
      thumb-url="https://camo.githubusercontent.com/4ea7fdaabf101c16965c0bd3ead816c9d7726a59b06f0800eb7c9a30212d5a6a/68747470733a2f2f63646e2e656c656d656e742d706c75732d782e636f6d2f656c656d656e742d706c75732d782e706e67"
    />
  </div>
</template>

<style scoped lang="scss">
.component-container {
  padding: 12px;
  border-radius: 15px;
  overflow: auto;

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
</style>
