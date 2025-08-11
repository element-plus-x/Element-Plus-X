<docs>
---
title: Device Type
---

Set the device type using the `device` property, default is `pc`

::: warning
When passing `h5`, pay attention to the interaction of the pop-up selection function and refer to the custom pop-up selection function to implement the interaction
:::
</docs>

<script setup lang="ts">
import type { UserInfo } from 'vue-element-plus-x/types/EditorSender';
import { EditorSender } from 'vue-element-plus-x';

const senderRef = ref<InstanceType<typeof EditorSender>>();

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
  senderRef.value?.customSetUser(user);
  dialogUserVisible.value = false;
}
</script>

<template>
  <div style="display: flex; flex-direction: column; gap: 12px">
    <EditorSender
      ref="senderRef"
      placeholder="This is a custom popup. In H5 environment, try typing @ to trigger the user selection popup"
      :custom-style="{ maxHeight: '240px' }"
      :custom-dialog="true"
      :user-list="userList"
      @show-at-dialog="showAtDialog"
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
  </div>
</template>
