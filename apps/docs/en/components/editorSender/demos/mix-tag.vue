<docs>
---
title: Mixed Tag Overwrite
---

Set mixed tags via the `setMixTags` method of the component Ref instance. Mixed tags will overwrite existing content.
</docs>

<script setup lang="ts">
import type { SelectTag } from 'vue-element-plus-x/types/EditorSender';
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
  }
]);

function setMixTags() {
  senderRef.value.setMixTags([
    [
      {
        type: 'gridInput',
        value:
          'This is the first line. Please draw a picture based on the following text: '
      },
      {
        type: 'inputTag',
        key: 'content',
        placeholder: '[Text Content]',
        value:
          'The sun shines through that large glass window into the room, first falling on the wall, then reflecting onto the table, and finally, also shining onto my lovely little bed.'
      },
      { type: 'gridInput', value: '. The style is ' },
      { type: 'selectTag', key: 'style', value: '1' },
      { type: 'gridInput', value: ', and the scene includes ' },
      {
        type: 'inputTag',
        key: 'content',
        placeholder: '[Scene Content]',
        value:
          'Light shines through the large French window into the room, illuminating the walls, floor, table, and bed.'
      },
      {
        type: 'gridInput',
        value:
          '. The main subject of the picture should be prominent, and the color matching and overall atmosphere should fit the theme of the text.'
      }
    ],
    [{ type: 'gridInput', value: 'This is the second line. '.repeat(4) }],
    [
      { type: 'gridInput', value: 'This is the third line. '.repeat(4) },
      {
        type: 'htmlTag',
        value:
          '<img class="img-tag" src="https://cdn.element-plus-x.com/element-plus-x.png" alt="">'
      }
    ]
  ]);
}
</script>

<template>
  <div style="display: flex; flex-direction: column; gap: 12px">
    <div style="display: flex">
      <el-button dark type="primary" plain @click="setMixTags">
        Mixed Tag Overwrite
      </el-button>
    </div>

    <EditorSender ref="senderRef" clearable :select-list="selectTagsArr" />
  </div>
</template>

<style scoped lang="less">
:deep(.at-select) {
  cursor: pointer;
  svg {
    display: inline-block;
  }
}
:deep(.img-tag) {
  width: 24px;
  height: 24px;
  vertical-align: bottom;
  display: inline-block;
}
</style>
