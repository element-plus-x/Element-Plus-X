<docs>
---
title: Custom Input Box Style
---
Easily control the style of the input box through `customStyle`. You can set `maxHeight` to limit the height of the input box, which will display a scrollbar when the content exceeds the specified height.
</docs>

<script setup lang="ts"></script>

<template>
  <div style="display: flex; flex-direction: column; gap: 20px">
    <EditorSender
      variant="updown"
      :custom-style="{
        fontSize: '24px',
        fontWeight: 700,
        maxHeight: '100px'
      }"
      style="
        background-image: linear-gradient(to left, #7fffaa 0%, #00ffff 100%);
        border-radius: 8px;
      "
    />

    <EditorSender
      :custom-style="{
        fontSize: '24px',
        fontWeight: 700,
        maxHeight: '200px',
        minHeight: '100px'
      }"
      style="
        background-image: linear-gradient(
          to top,
          #fdcbf1 0%,
          #fdcbf1 1%,
          #e6dee9 100%
        );
        border-radius: 8px;
      "
    />
  </div>
</template>

<style scoped lang="scss">
.isSelect {
  color: #626aef !important;
  border: 1px solid #626aef !important;
  border-radius: 15px;
  padding: 3px 12px;
  font-weight: 700;
}
</style>
