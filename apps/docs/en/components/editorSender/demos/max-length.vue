<docs>
---
title: Limit Maximum Input Length
---

Limit the maximum number of characters in the input box via `maxLength`.

:::danger
This configuration has a relatively high performance cost. Please do not set it unless necessary (like Doubao and Wenxin Yiyan, which do not limit this). Do not sacrifice major functions for minor features.
:::
</docs>

<template>
  <EditorSender :max-length="10" />
</template>
