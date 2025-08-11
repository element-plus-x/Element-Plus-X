<docs>
---
title: Insert Custom Tag
---

Configure the custom tag configuration array via the `customTrigger` property.

Use the component Ref to call the `setCustomTag` method to insert **custom tag** content at the cursor position. This method accepts two parameters: the first is the identifier prefix of the custom tag, and the second is the `id` of the tag list item to be inserted.

:::details Expand to view configuration array type
```ts
interface CustomTag {
  dialogTitle: string,
  prefix: string,
  tagList: TagInfo[]
}

interface TagInfo {
  id: string,
  name: string,
  pinyin?: string
}
```
:::
</docs>

<script setup lang="ts">
import type { CustomTag } from 'vue-element-plus-x/types/EditorSender';
import { ref } from 'vue';

const senderRef = ref();

const customTagsArr = ref<CustomTag[]>([
  {
    dialogTitle: 'Topic Tags',
    prefix: '#',
    tagList: [
      { id: '1', name: 'Topic 1' },
      { id: '2', name: 'Topic 2' },
      { id: '3', name: 'Topic 3' }
    ]
  },
  {
    dialogTitle: 'File Tags',
    prefix: '/',
    tagList: [
      { id: '1', name: 'File 1' },
      { id: '2', name: 'File 2' },
      { id: '3', name: 'File 3' }
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
        @click="senderRef?.setCustomTag('#', '2')"
      >
        Insert Custom Topic Tag
      </el-button>
    </div>

    <EditorSender
      ref="senderRef"
      :custom-trigger="customTagsArr"
      placeholder="# triggers topic selection, / triggers file selection"
      clearable
    />
  </div>
</template>

<style scoped lang="less">
:deep(.at-select) {
  cursor: pointer;

  svg {
    display: inline-block;
  }
}
</style>
