---
'vue-element-plus-x': patch
---

修复 useRecord 重复启动时遗留语音识别实例的问题，等待当前会话结束后再允许启动，并在同步启动失败后释放引用以支持重试。
