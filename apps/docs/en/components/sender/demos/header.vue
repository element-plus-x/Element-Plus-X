<docs>
---
title: Header Slot
---

Use the `#header` slot to customize the input header content.

::: warning Deprecation Warning
The following methods will be removed in the next major version. It is recommended to use `v-model:openHeader` for two-way binding control:

- `senderRef.value.openHeader()` Open header container (deprecated)
- `senderRef.value.closeHeader()` Close header container (deprecated)
:::

::: tip Recommended Usage
Use `v-model:openHeader` for two-way binding to control header display state:

```vue
<Sender v-model:openHeader="openHeader">
  <template #header>Header content</template>
</Sender>
```
:::
</docs>

<script setup lang="ts">
import { CircleClose } from '@element-plus/icons-vue';

const senderValue = ref('');
const openHeader = ref(true); // Use v-model:openHeader to control header display state

function toggleHeader() {
  openHeader.value = !openHeader.value;
}

function closeHeader() {
  openHeader.value = false;
}
</script>

<template>
  <div
    style="
      display: flex;
      flex-direction: column;
      gap: 12px;
      height: 300px;
      justify-content: space-between;
    "
  >
    <el-button style="width: fit-content" @click="toggleHeader">
      {{ openHeader ? 'Close Header' : 'Open Header' }}
    </el-button>
    <Sender v-model="senderValue" v-model:open-header="openHeader">
      <template #header>
        <div class="header-self-wrap">
          <div class="header-self-title">
            <div class="header-left">💯 Welcome to Element Plus X</div>
            <div class="header-right">
              <el-button @click.stop="closeHeader">
                <el-icon><CircleClose /></el-icon>
                <span>Close Header</span>
              </el-button>
            </div>
          </div>
          <div class="header-self-content">🦜 Custom Header Content</div>
        </div>
      </template>
    </Sender>
  </div>
</template>

<style scoped lang="less">
.header-self-wrap {
  display: flex;
  flex-direction: column;
  padding: 16px;
  height: 200px;
  .header-self-title {
    width: 100%;
    display: flex;
    height: 30px;
    align-items: center;
    justify-content: space-between;
    padding-bottom: 8px;
  }
  .header-self-content {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    color: #626aef;
    font-weight: 600;
  }
}
</style>
