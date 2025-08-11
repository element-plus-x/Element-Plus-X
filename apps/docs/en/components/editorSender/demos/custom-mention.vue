<docs>
---
title: Custom Mention Example
---

Configure async matching function via `asyncMatchFun` property. `@` triggers user tag popup.
</docs>

<script setup lang="ts">
import type { TagInfo, UserInfo } from 'vue-element-plus-x/types/EditorSender';
import { ref } from 'vue';
import { EditorSender } from 'vue-element-plus-x';

const editorRef = ref<InstanceType<typeof EditorSender>>();
// Custom @popup related logic
const userList = ref([
  { id: '5', name: 'Zhang Sanfeng' },
  { id: '1', name: 'Zhang San' },
  { id: '2', name: 'Li Si' },
  { id: '3', name: 'Wang Wu' },
  { id: '4', name: 'Ma Liu' }
]);
const dialogUserVisible = ref(false);
function showAtDialog() {
  dialogUserVisible.value = true;
}
function checkUser(user: UserInfo) {
  editorRef.value?.customSetUser(user);
  dialogUserVisible.value = false;
}

// Custom trigger symbol related logic
const customTrigger = ref([
  {
    dialogTitle: 'Group Topics',
    prefix: '#',
    tagList: [
      { id: 'ht1', name: 'Topic 1' },
      { id: 'ht2', name: 'Topic 2' }
    ]
  },
  {
    dialogTitle: 'Group Tools',
    prefix: '!',
    tagList: [
      { id: 'gj1', name: 'Tool 1' },
      { id: 'gj2', name: 'Tool 2' }
    ]
  }
]);
const dialogCustomVisible = ref(false);
const viewPrefix = ref('');
function showTagDialog(prefix: string) {
  viewPrefix.value = prefix;
  dialogCustomVisible.value = true;
}
function checkTag(tag: TagInfo) {
  editorRef.value?.customSetTag(viewPrefix.value, tag);
  dialogCustomVisible.value = false;
}

// Custom selection tag related logic
const selectList = ref([
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
const viewKey = ref('');
const dialogSelectVisible = ref(false);
const currentSelectElm = ref<HTMLElement>();
function showSelectDialog(key: string, elm?: HTMLElement) {
  viewKey.value = key;
  // elm value indicates internal chat box唤起
  currentSelectElm.value = elm;
  dialogSelectVisible.value = true;
}
function checkSelect(tag: TagInfo) {
  // No currentSelectElm indicates external call for insertion
  if (!currentSelectElm.value) {
    editorRef.value?.setSelectTag(viewKey.value, tag.id);
  } else {
    // Has value for tag update method
    editorRef.value?.updateSelectTag(currentSelectElm.value, tag);
  }
  dialogSelectVisible.value = false;
}
</script>

<template>
  <div style="display: flex; flex-direction: column; gap: 12px">
    <EditorSender
      ref="editorRef"
      placeholder="This is a custom popup, you can try entering @, !, # triggers"
      :custom-style="{ maxHeight: '240px' }"
      :custom-dialog="true"
      :select-list="selectList"
      :user-list="userList"
      :custom-trigger="customTrigger"
      @show-at-dialog="showAtDialog"
      @show-tag-dialog="showTagDialog"
      @show-select-dialog="showSelectDialog"
    />

    <el-dialog
      v-model="dialogUserVisible"
      title="Custom User Selection Popup"
      width="500"
    >
      <p v-for="user of userList" :key="user.id" @click="checkUser(user)">
        {{ user.name }}
      </p>
    </el-dialog>

    <el-dialog
      v-model="dialogCustomVisible"
      title="Custom Trigger Symbol Selection Popup"
      width="500"
    >
      <template v-for="option of customTrigger" :key="option.prefix">
        <div v-if="option.prefix === viewPrefix">
          <p v-for="tag of option.tagList" :key="tag.id" @click="checkTag(tag)">
            {{ tag.name }}
          </p>
        </div>
      </template>
    </el-dialog>

    <el-dialog
      v-model="dialogSelectVisible"
      title="Custom Selection Tag Popup"
      width="500"
    >
      <template v-for="option of selectList" :key="option.key">
        <div v-if="option.key === viewKey">
          <p
            v-for="tag of option.options"
            :key="tag.id"
            @click="checkSelect(tag)"
          >
            {{ tag.name }}
          </p>
        </div>
      </template>
    </el-dialog>
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
