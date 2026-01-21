<docs>
---
title: 前缀插槽
---

通过 `#prefix` 插槽用于自定义输入框的前缀内容。
</docs>

<template>
  <XSender>
    <!-- 自定义 前缀插槽 -->
    <template #prefix>
      <div>
        <el-button>自定义</el-button>
        <el-button>前缀</el-button>
      </div>
    </template>
  </XSender>
</template>
