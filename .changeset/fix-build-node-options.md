---
'vue-element-plus-x': patch
---

修复构建脚本在 macOS/Linux 下未设置 NODE_OPTIONS 的问题，使用跨平台方式为类型生成、类型检查和打包进程设置内存限制。
