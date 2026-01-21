<docs>
---
title: 自定义输入框样式
---
通过 `customStyle` 方便对输入框的样式透传，你可以设置 `maxHeight` 来限制输入框的高度。这样实现在一定的高度下出现滚动条。
</docs>

<template>
  <XSender variant="updown" :custom-style="{ maxHeight: '200px' }"></XSender>
</template>
