---
'vue-element-plus-x': patch
---

修复 Attachments 拖拽时覆盖目标元素定位样式的问题，仅为静态定位目标临时设置 relative，并在拖拽结束、切换目标、隐藏上传或卸载时恢复原有样式。
