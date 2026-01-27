<docs>
---
title: 头部插槽
---

通过 `#header` 插槽用于自定义输入框的头部内容。

::: warning 废弃警告
以下方法将在下个大版本中移除，推荐使用 `v-model:openHeader` 进行双向绑定控制：

- `senderRef.value.openHeader()` 打开头部容器 (已废弃)
- `senderRef.value.closeHeader()` 关闭头部容器 (已废弃)
:::

::: tip 推荐用法
使用 `v-model:openHeader` 进行双向绑定控制头部显示状态：

```vue
<Sender v-model:openHeader="openHeader">
  <template #header>头部内容</template>
</Sender>
```
:::
</docs>

<script setup lang="ts">
import { CircleClose } from '@element-plus/icons-vue';

const senderValue = ref('');
const openHeader = ref(true); // 使用 v-model:openHeader 控制头部显示状态

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
      {{ openHeader ? '关闭头部' : '打开头部' }}
    </el-button>
    <MentionSender v-model="senderValue" v-model:open-header="openHeader">
      <template #header>
        <div class="header-self-wrap">
          <div class="header-self-title">
            <div class="header-left">💯 欢迎使用 Element Plus X</div>
            <div class="header-right">
              <el-button @click.stop="closeHeader">
                <el-icon><CircleClose /></el-icon>
                <span>关闭头部</span>
              </el-button>
            </div>
          </div>
          <div class="header-self-content">🦜 自定义头部内容</div>
        </div>
      </template>
    </MentionSender>
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
