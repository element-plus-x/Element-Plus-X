<docs>
---
title: 插入 自定义标签
---

通过 `triggerConfig` 属性配置自定义标签配置数组。每个选择标签配置对象包含以下属性：
- `dialogTitle`：选择标签弹窗标题
- `key`：选择标签标识，用于插入选择标签时的标识
- `options`：选择标签选项数组

使用组件 Ref 调用 `setTrigger` 方法在光标位置插入 **自定义标签** 内容，这个方法接受两个参数，第一个参数为自定义标签的标识符前缀，第二个参数为插入的标签列表项的 `id`。

:::details 展开查看配置数组类型
```ts
interface TagInfo {
  id: string,
  name: string,
  pinyin?: string
}
```
:::
</docs>

<script setup lang="ts">
import { reactive } from 'vue';

const senderRef = ref();

const customTagsArr = reactive([
  {
    dialogTitle: '话题标签',
    key: '#',
    options: [
      { id: '1', name: '话题1' },
      { id: '2', name: '话题2' },
      { id: '3', name: '话题3' }
    ]
  },
  {
    dialogTitle: '文件标签',
    key: '/',
    options: [
      { id: '1', name: '文件1' },
      { id: '2', name: '文件2' },
      { id: '3', name: '文件3' }
    ]
  }
]);
</script>

<template>
  <div style="display: flex; flex-direction: column; gap: 12px">
    <div style="display: flex">
      <el-button
        dark
        type="primary"
        plain
        @click="senderRef?.setTrigger('#', '2')"
      >
        插入 自定义话题标签
      </el-button>
    </div>

    <EditorSender
      ref="senderRef"
      :trigger-config="customTagsArr"
      placeholder="# 符号触话题选择，/ 符号触发文件选择"
      clearable
    />
  </div>
</template>

<style scoped lang="less">
</style>
