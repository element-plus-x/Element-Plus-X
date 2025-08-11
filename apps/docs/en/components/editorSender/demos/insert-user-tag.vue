<docs>
---
title: Insert User Tag
---

Configure the user tag configuration array via the `userList` property. `@` triggers the user tag popup.

Use the component Ref to call the `setUserTag` method to insert **user tag** content at the cursor position. This method accepts one parameter: the identifier of the user tag. If you want to support pinyin search, please configure the `pinyin` property for the user tag.

:::details Expand to view configuration array type
```ts
interface UserInfo {
  id: string, // User identifier
  name: string, // User name
  avatar?: string | URL, // User avatar
  pinyin?: string // Pinyin of user name, used for search
}
```
:::
</docs>

<script setup lang="ts">
import type { UserInfo } from 'vue-element-plus-x/types/EditorSender';
import { ref } from 'vue';

const senderRef = ref();

const userTagsArr = ref<UserInfo[]>([
  { id: '5', name: 'Zhang Sanfeng', pinyin: 'zhang san feng' },
  { id: '1', name: 'Zhang San', pinyin: 'zhang san' },
  { id: '2', name: 'Li Si', pinyin: 'li si' },
  { id: '3', name: 'Wang Wu', pinyin: 'wang wu' },
  {
    id: '4',
    name: 'Hejiayue',
    pinyin: 'he jia yue',
    avatar: 'https://avatars.githubusercontent.com/u/76239030?v=4&size=40'
  }
]);
</script>

<template>
  <div style="display: flex; flex-direction: column; gap: 12px">
    <div style="display: flex">
      <el-button dark type="primary" plain @click="senderRef?.setUserTag('2')">
        Insert User Tag
      </el-button>
    </div>
    <EditorSender
      ref="senderRef"
      :user-list="userTagsArr"
      placeholder="@ symbol triggers user selection"
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
