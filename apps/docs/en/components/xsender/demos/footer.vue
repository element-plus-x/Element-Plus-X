<docs>
---
title: 底部插槽
---

通过 `#footer` 插槽设置输入框 底部内容
</docs>

<template>
  <XSender>
    <!-- 自定义 底部插槽 -->
    <template #footer>
      <div
        style="
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 12px;
        "
      >
        自定义底部内容
      </div>
    </template>
  </XSender>
</template>
