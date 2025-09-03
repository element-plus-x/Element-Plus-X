---
title: useXStream
---


## Introduction

This hook function allows users to more conveniently control **streaming requests**. It provides `initiate request`, `cancel request`, returns `loading` request state, returns SSE protocol `real-time data stream`, and returns request `error` information.

::: info
Currently only SSE and SIP protocol requests have been tested, other protocols are yet to be tested. If you have good ideas or discoveries, you are welcome to join the community group 👨‍👩‍👧‍👧 **[Community Group](https://element-plus-x.com/en/introduce.html#%F0%9F%91%A5-%E7%A4%BE%E5%8C%BA%E6%94%AF%E6%8C%81)**, contact us, share solutions, submit issues and PRs. Please read the 👉 **[Development Guide](https://element-plus-x.com/en/guide/develop.html)** for submission specifications.
:::

## Code Examples

<demo src="./demos/useSSE.vue"></demo>

<demo src="./demos/useSIP.vue"></demo>

::: warning
The parsing rules of this hook are consistent with ant-design-x, all handled internally. **Feel free to switch and use**

sseEventPart
**`'event: message\ndata: {"id":"${i}","content":"${contentChunks[i]}"}\n\n'`**

```ts
// Default stream separator (uses two newlines to split a stream data)
const DEFAULT_STREAM_SEPARATOR = '\n\n';
// Default part separator (uses a single newline to break current data)
const DEFAULT_PART_SEPARATOR = '\n';
// Default key-value separator (uses colon)
const DEFAULT_KV_SEPARATOR = ':';
```

:::

## Returned Hooks

| Property    | Description                  | Type                                          |
| ----------- | ---------------------------- | --------------------------------------------- |
| startStream | Start request in stream mode | `({readableStream, transformStream}) => void` |
| cancel      | Cancel streaming request     | `() => void`                                  |
| loading     | Is streaming data loading    | `boolean`                                     |
| data        | Real-time streaming data     | `string`                                      |
| error       | Streaming request error info | `string`                                      |
