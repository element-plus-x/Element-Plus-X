<docs>
---
title: 插入 选择标签
---

通过 `selectConfig` 属性配置选择标签配置数组。每个选择标签配置对象包含以下属性：

- `dialogTitle`：选择标签弹窗标题
- `key`：选择标签标识，用于插入选择标签时的标识
- `options`：选择标签选项数组
- `multiple`：是否支持多选，默认值为 `false`
- `emptyText`：选择标签选项为空时的提示文本

::: info
你还可以从外部调用 `showSelect` 方法打开选择标签弹窗。
<br>
使用组件 Ref 调用 `setSelect` 方法在光标位置插入 **选择标签** 内容。
:::

:::details 展开查看配置数组类型
```ts
interface SelectItem {
  id: string, // 选择标签选项标识
  name: string, // 选择标签选项名称
  preview?: string | URL // 选择标签选项预览图片
}
```
:::
</docs>

<script setup lang="ts">
import { reactive } from 'vue';

const senderRef = ref();

const selectConfig = reactive([
  {
    dialogTitle: '风格选择',
    key: 'style',
    multiple: true,
    options: [
      {
        id: '1',
        name: '人像摄影',
        preview: 'https://www.jianfv.top/style/style1.webp'
      },
      {
        id: '2',
        name: '电影写真',
        preview: 'https://www.jianfv.top/style/style2.webp'
      },
      {
        id: '3',
        name: '中国风',
        preview: 'https://www.jianfv.top/style/style3.webp'
      }
    ]
  },
  {
    dialogTitle: '字体选择',
    key: 'font',
    options: [
      { id: '1', name: '宋体' },
      { id: '2', name: '微软雅黑' },
      { id: '3', name: '楷体' }
    ]
  }
]);

function openSelectDialog() {
  senderRef.value?.showSelect('style', document.getElementById('dialogBtn')!);
}
</script>

<template>
  <div style="display: flex; flex-direction: column; gap: 12px">
    <div style="display: flex">
      <el-button
        dark
        type="primary"
        plain
        @click="senderRef?.setSelect('style', '1')"
      >
        插入 风格选择标签
      </el-button>
      <el-button
        dark
        type="primary"
        plain
        @click="senderRef?.setSelect('font', '2')"
      >
        插入 字体选择标签
      </el-button>
      <el-button
        id="dialogBtn"
        dark
        type="primary"
        plain
        @click="openSelectDialog"
      >
        外部调用选择标签弹窗
      </el-button>
    </div>
    <EditorSender ref="senderRef" :select-config="selectConfig" clearable />
  </div>
</template>

<style scoped lang="less">
</style>
