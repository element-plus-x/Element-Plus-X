<docs>
---
title: 插入 用户标签
---

通过 `mentionConfig` 属性配置用户标签。 `@` 触发用户标签弹窗。

使用组件 Ref 调用 `setMention` 方法在光标位置插入 **用户标签** 内容，这个方法接受一个参数，用户标签的标识。如果你想支持拼音搜索，请为用户标签配置 `pinyin` 属性。

:::details 展开查看配置数组类型
```ts
interface UserInfo {
  id: string, // 用户标识
  name: string, // 用户名称
  avatar?: string | URL, // 用户头像
  pinyin?: string // 用户名称的拼音，用于搜索
}
```
:::
</docs>

<script setup lang="ts">
import { reactive } from 'vue';

const senderRef = ref();

const userTagsArr = reactive({
  dialogTitle: '用户选择',
  callEvery: true,
  options: [
    { id: '5', name: '张三丰', pinyin: 'zhang san feng' },
    { id: '1', name: '张三', pinyin: 'zhang san' },
    { id: '2', name: '李四', pinyin: 'li si' },
    { id: '3', name: '王五', pinyin: 'wang wu' },
    {
      id: '4',
      name: 'Hejiayue',
      pinyin: 'he jia yue',
      avatar: 'https://avatars.githubusercontent.com/u/76239030?v=4&size=40'
    }
  ]
});
</script>

<template>
  <div style="display: flex; flex-direction: column; gap: 12px">
    <div style="display: flex">
      <el-button dark type="primary" plain @click="senderRef?.setMention('2')">
        插入 用户标签
      </el-button>
    </div>
    <EditorSender
      ref="senderRef"
      :mention-config="userTagsArr"
      placeholder="@ 符号触发用户选择"
      clearable
    />
  </div>
</template>

<style scoped lang="less">
</style>
