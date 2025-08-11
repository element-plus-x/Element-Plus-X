<docs>
---
title: Insert Select Tag
---

Configure the select tag configuration array via the `selectList` property.

Use the component Ref to call the `setSelectTag` method to insert **select tag** content at the cursor position. This method accepts two parameters: the first is the identifier of the select tag, and the second is the option identifier (default value) of the select tag.

::: info
You can also call the `openSelectDialog` method from outside to open the select tag popup. This method accepts a configuration object with the following type:

```ts
interface SelectDialogOption {
  key: string;
  elm: HTMLElement;
  beforeText?: string;
  afterText?: string;
}
```
:::

:::details Expand to view configuration array type
```ts
interface SelectTag {
  dialogTitle: string, // Select tag popup title
  key: string, // Select tag identifier, used when inserting select tags
  options: SelectItem[] // Select tag options array
}

interface SelectItem {
  id: string, // Select tag option identifier
  name: string, // Select tag option name
  preview?: string | URL // Select tag option preview image
}
```
:::
</docs>

<script setup lang="ts">
import type {
  SelectDialogOption,
  SelectTag
} from 'vue-element-plus-x/types/EditorSender';
import { ref } from 'vue';

const senderRef = ref();

const selectTagsArr = ref<SelectTag[]>([
  {
    dialogTitle: 'Style Selection',
    key: 'style',
    options: [
      {
        id: '1',
        name: 'Portrait Photography',
        preview: 'https://www.jianfv.top/style/style1.webp'
      },
      {
        id: '2',
        name: 'Film Photography',
        preview: 'https://www.jianfv.top/style/style2.webp'
      },
      {
        id: '3',
        name: 'Chinese Style',
        preview: 'https://www.jianfv.top/style/style3.webp'
      }
    ]
  },
  {
    dialogTitle: 'Font Selection',
    key: 'font',
    options: [
      { id: '1', name: 'SimSun' },
      { id: '2', name: 'Microsoft YaHei' },
      { id: '3', name: 'KaiTi' }
    ]
  }
]);

function openSelectDialog() {
  senderRef.value?.openSelectDialog({
    key: 'style',
    elm: document.getElementById('dialogBtn')!,
    beforeText: '[Custom Prefix Content]',
    afterText: '[Custom Suffix Content]'
  } as SelectDialogOption);
}
</script>

<template>
  <div style="display: flex; flex-direction: column; gap: 12px">
    <div style="display: flex">
      <el-button
        dark
        type="primary"
        plain
        @click="senderRef?.setSelectTag('style', '1')"
      >
        Insert Style Select Tag
      </el-button>
      <el-button
        dark
        type="primary"
        plain
        @click="senderRef?.setSelectTag('font', '2')"
      >
        Insert Font Select Tag
      </el-button>
      <el-button
        id="dialogBtn"
        dark
        type="primary"
        plain
        @click="openSelectDialog"
      >
        External Call Select Tag Popup
      </el-button>
    </div>
    <EditorSender ref="senderRef" :select-list="selectTagsArr" clearable />
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
