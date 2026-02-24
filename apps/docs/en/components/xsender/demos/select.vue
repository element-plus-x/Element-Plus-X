<docs>
---
title: Select Picker
---

Use `setSelect` to insert a select picker and preset a value.
Use `showSelect` to open the picker dialog anchored to a target element.
Use `setChatNode` to preset the input content template.
</docs>

<script setup lang="ts">
import type { XSender } from 'vue-element-plus-x';
import { ref } from 'vue';

const senderRef = ref<InstanceType<typeof XSender>>();

const selectConfig = ref([
  {
    dialogTitle: 'Image Style',
    key: 'style',
    options: [
      {
        id: '1',
        name: 'Portrait',
        preview: '/logo.png'
      },
      {
        id: '2',
        name: 'Cinematic',
        preview: '/logo.png'
      },
      {
        id: '3',
        name: 'Chinese Style',
        preview: '/logo.png'
      }
    ],
    multiple: false
  }
]);

function onSetBasic() {
  senderRef.value?.setSelect('style', '1');
}

function openSelectDialog() {
  senderRef.value?.showSelect('style', document.getElementById('target')!);
}

function onSetModel() {
  senderRef.value?.setChatNode([
    [
      {
        type: 'Write',
        text: 'Please generate an image in '
      },
      {
        type: 'Select',
        key: 'style',
        id: '1',
        name: 'Chinese Style'
      },
      {
        type: 'Write',
        text: ' style.'
      }
    ]
  ]);
}
</script>

<template>
  <div>
    <div style="margin-bottom: 20px">
      <el-button type="primary" @click="onSetBasic"> Set via API </el-button>
      <el-button id="target" type="primary" @click="openSelectDialog">
        Open picker (anchored)
      </el-button>
      <el-button type="primary" @click="onSetModel">
        Set template content
      </el-button>
    </div>
    <XSender ref="senderRef" variant="updown" :select-config="selectConfig" />
  </div>
</template>
