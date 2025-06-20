# useXStream 🌱

## 介绍

这个钩子函数，可以让用户更方便的控制 **流式请求**。提供 `发起请求` ，`中断请求` ，返回 `loading` 请求状态，返回 SSE 协议 `实时的数据流`，返回请求 `error` 信息。

::: info
目前只测试了 SSE 和 SIP 协议请求，其他协议的请求还有待测试，如果您好的想法和发现，欢迎进交流群 👨‍👩‍👧‍👧 **[交流群](https://github.com/element-plus-x/Element-Plus-X?tab=readme-ov-file#-%E7%A4%BE%E5%8C%BA%E6%94%AF%E6%8C%81)**，与我们取得联系，欢迎交流方案，提交 issue 和 pr。提交规范请阅读 👉 **[开发文档](https://element-plus-x.com/guide/develop.html)**
:::

## 代码演示

<demo src="./demos/useSSE.vue"></demo>

<demo src="./demos/useSIP.vue"></demo>

::: warning
这个 hooks 的解析规则，也和 ant-design-x 一致，都是在内部做了处理。**请放心切换使用**

sseEventPart
**`'event: message\ndata: {"id":"${i}","content":"${contentChunks[i]}"}\n\n'`**

```ts
// 数据流默认分隔符（使用两个换行符，分割一条流数据）
const DEFAULT_STREAM_SEPARATOR = '\n\n'
// 分段默认分隔符（使用单个换行符，换行当前数据）
const DEFAULT_PART_SEPARATOR = '\n'
// 键值对默认分隔符（使用冒号）
const DEFAULT_KV_SEPARATOR = ':'
```
:::

## 返回钩子

| 属性名  | 说明                 | 类型                         |
| ----- | -------------------- | ---------------------------- |
| startStream | 开始请求流模式接口 | `({readableStream, transformStream}) => void` |
| cancel | 中断流式请求 | `() => void` |
| loading | 是否正在请求流式数据 | `boolean` |
| data | 实时返回的流式数据 | `string` |
| error | 流式请求报错信息 | `string` |
