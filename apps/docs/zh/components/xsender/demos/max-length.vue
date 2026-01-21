<docs>
---
title: 输入长度限制
---

可以通过 `maxLength` 来限制输入框的最大输入长度。

::: danger

该配置项性能开销较大 非必要情况请别设置（像豆包和文心一言都不对这块做限制不应因小失大）

:::
</docs>

<template>
  <XSender :max-length="10" placeholder="输入长度限制"></XSender>
</template>
