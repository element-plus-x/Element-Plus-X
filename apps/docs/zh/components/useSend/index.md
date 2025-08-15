---
title: 'useSend'
---

# useSend & XRequest 🌳

## XRequest已废弃，推荐使用 hook-fetch（https://jsonlee12138.github.io/hook-fetch/）

## 背景介绍

基于 `ant-design-x` 的 `XRequest`，`XStream`，我们进行了深入的学习和讨论。

在复刻 `XStream` 后，针对更通用的 **控制请求数据** 和 **中断请求** 的场景，我们将 `ant-design-x` 的 `XRequest` 进行了重构，将其拆分成 **`前端终止场景`** 和 **`请求终止场景`**

两种场景 分别对应

- hooks `useSend` -- 前端终止场景
- 工具类 `XRequest` -- 请求终止场景

**🍒 两者可以单独拆开使用，组合使用可实现 `useXStream`，下面是他们的使用示例**

## 代码演示

只需要传一个 `开始方法` ，即可获得 对应的 **loading** 状态，以及 对应的 **finish** 方法。

单个控制，代码不超过 10 行

<demo src="./demos/useSend-base.vue"></demo>

有了对状态的控制，我们可以很方便的，自定义一些按钮的加载状态

<demo src="./demos/useSend-use.vue"></demo>

知道了 `useSend` 的基本用法后，既然有 `前端加载状态` 的控制，那一定少不了 `请求状态` 控制。接下来我们来介绍一下 工具类 `XRequest` 的简单用法。

<demo src="./demos/XRequest-base.vue"></demo>

::: warning
这里我们为了让大家方便阅读文档，看到请求，简单的写了一个 node 服务。这个案例中，💩 请不要疯狂点击。会疯狂请求接口，请大家节制一点。💩 我们没做任何安全处理 🙉 因为不会

这也可以反向让大家知道更了解，工具类 `XRequest` 的用法，只对 `请求` 处理。
:::

<demo src="./demos/XRequest-use.vue"></demo>

下面介绍一下，`useSend` 和 `useSendStream` 相互结合的用法

**使用 `useSend` 对前端进行状态控制，使用 `useSendStream` 对后端进行状态控制**

<demo src="./demos/useSend-XRequest.vue"></demo>

## 配置参数 和 返回钩子

#### - `useSend`

- **参数**

| 参数名       | 说明       | 类型         |
| ------------ | ---------- | ------------ |
| sendHandler  | send 方法  | `() => void` |
| abortHandler | abort 方法 | `() => void` |

- **返回值**

| 属性名  | 说明                   | 类型         |
| ------- | ---------------------- | ------------ |
| send    | 开始 加载状态 支持回调 | `() => void` |
| abort   | 中断 加载状态 支持回调 | `() => void` |
| loading | 加载状态               | `boolean`    |
| finish  | 结束 加载状态          | `() => void` |

#### - `XRequest`

- **参数**

| 配置参数名  | 说明                                         | 类型                                                   |
| ----------- | -------------------------------------------- | ------------------------------------------------------ |
| baseURL     | 基础请求地址                                 | `string`                                               |
| type        | 请求类型，默认 SSE                           | `BaseSSEProps<T = string>.type?: SSEType \| undefined` |
| transformer | transformer 回调，在这里可以对数据做解析处理 | `(e: string) => string \| undefined`                   |
| onMessage   | 请求中的回调                                 | `(msg: string \| undefined) => void`                   |
| onError     | 请求报错的回调                               | `(es: EventSource, e: Event) => void`                  |
| onOpen      | SSE Open 状态                                | `SSEWithSSEProps.onOpen?: (() => void) \| undefined`   |
| onAbort     | 请求被终止的回调                             | `(messages: (string \| undefined)[]) => void`          |
| onFinish    | 请求结束的回调                               | `(data: (string \| undefined)[]) => void`              |

- **返回值**

| 属性名 | 说明         | 类型                                                                                                                                     |
| ------ | ------------ | ---------------------------------------------------------------------------------------------------------------------------------------- |
| send   | 开始请求接口 | `XRequest<string \| undefined>.send(url: string, options?: EventSourceInit \| BaseFetchOptions): Promise<XRequest<string \| undefined>>` |
| abort  | 中断请求     | `XRequest<string \| undefined>.abort(): void`                                                                                            |

## 总结

`useSend` 可以让用户更方便在前端展示和控制， **加载中** 状态。是一种对 `loading` 状态的封装方案
接受 `发送回调` 和一个`中断回调` ，提供 `发送` ，`中断 loading 状态` ，`结束 loading 状态` ，返回 `loading` 状态。

`XRequest` 是一个请求的封装，提供了更便捷的请求方式，接受一个 `请求配置` ，返回一个 `请求响应` 对象。
