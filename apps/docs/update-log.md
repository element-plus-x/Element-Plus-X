## [v1.2.0] - 2025-05-05

### 💥 破坏性变更

- `types`  **TS类型引入 写法变更** ，升级后请修改原来的类型写法

  以前的写法：太长了

  ```vue
  import { BubbleProps } from 'vue-element-plus-x/types/components/Bubble/types.d.ts'
  ```

  v1.2.0 以后写法：简洁一些

  ```vue
  import { BubbleProps } from 'vue-element-plus-x/types/Bubble'
  ```

- 自动引入冲突问题，如果你的项目中使用了 **unplugin-auto-import/vite** 自动引入了 **vue** 和 **ElementPlus** ，可能会在控制台看到这个报错![image-20250505212717436](/public/image-20250505212717436.png)![image-20250505213158083](/public/image-20250505213158083.png)

  ```tex
  h 函数的问题是 由于组件库内置 Mermaid.js 美人鱼Js 处理基础的图表和函数，但是 Mermaid.js 内置一个渲染 h 方法，和 vue 中的 h 函数冲突导致的。
  ElButtonGroup 报错是由于 unplugin-vue-components/resolvers 这个包的 ElementPlusResolver 会回到主重复引入的问题。
  ```

  **解决方案：修改项目 vite 配置**

  ```ts
  // vite.config.ts

  // plugin 部分

  plugins: [
    AutoImport({
      imports: ['vue'],
      ignore: ['h'], // 忽略自动导入 h
      resolvers: [
        ElementPlusResolver({
          exclude: /ElButtonGroup/ // 忽略自动导入 ElButtonGroup
        })
      ],
      dts: 'src/auto-import.d.ts'
    }),
    Components({
      resolvers: [ElementPlusResolver()],
    }),
  ]
  ```

  在项目后续的使用 h 函数中，手动引入。ElButtonGroup 暂时没有遇到有使用的地方，感觉是 unplugin-vue-components/resolvers 包没有更新对 ElButtonGroup 的处理导致的。在 elementplus 源码中都貌似没有看到有使用的地方。

  ```vue
  import { h } from 'vue'
  ```

  💩因为是做的二次开发，所以发现问题后，暂时选择这么处理。如果有更好，更优雅的解决方案可以和我们联系，交流下处理方案。💩

### 🐛 修复

- 修复 **`Typewriter`**  打字组件，md 代码高亮输出时候，超出最大宽度的样式问题。
- 修复 **`BubbleList`**  气泡列表组件，清空数组后，再次新增气泡，失去自动滚动的问题。
- 修复 **`Sender`** 、 **`MentionSender`** footer 插槽 点击后自动聚焦问题。

### 🚀 新增功能

- **`Prompts`** 提示集组件，用于显示一组与当前上下文相关的预定义的问题或建议。

- **`Conversations`** 会话管理组件。支持分组展示、菜单交互、滚动加载、自定义样式等功能。适用于消息列表、文件管理、任务分组等场景，通过灵活的配置和插槽扩展，满足多样化的业务需求。

- **`FilesCard`** 文件卡片组件，附支持多种文件类型（图片、文档、压缩包等）的可视化呈现，包含文件图标、名称、描述、状态等信息。

- **`Attachments`** 附件上传组件，附件管理组件，支持文件列表展示、上传、拖拽交互、滚动浏览等功能，适用于需要处理多文件上传和展示的场景（如表单附件、文件管理界面）。

- **`Typewriter`**  打字器组件的 **markdown-it** ，新增了 **`prismjs`** 高亮代码块样式文件，开发者可以自行引入

  **`Typewriter`**  打字器组件的 **markdown-it** ，新增了 **`Mermaid.js`** 用来支持简单的 **图表** 和 **函数** 的渲染
  **`Typewriter`**  打字器组件的 **markdown-it** ，开放了第三方 mdPlugins 插件的接收处理，和第三方代码高亮 highlight 逻辑处理，详情可移步👉 [Typewriter文档](https://element-plus-x.com/components/typewriter/)

###  📚文档更新

- 更新线上开发计划文档，展示我们陆续的开发计划。有想法提 pr 的伙伴，可以先看看我们的开发计划，有感兴趣的模块，可以进交流群，一起研究推进 **[开发计划](https://element-plus-x.com/roadmap.html)**
- 更新首页介绍，交流要求文档。`antdx` 全部组件已经复刻完毕。

## [v1.1.6] - 2025-04-16

### 🐛 修复

- 修复 **`Thinking`**  思考中组件展开 收起动画卡顿 bug。

### 🚀 新增功能

- **`Typewriter`** 打字器组件，新增 **雾化效果**。**`Bubble`** 气泡组件、**`BubbleList`** 气泡列表组件，在不自定义内容插槽的时候，自动继承，支持雾化效果属性。
- **`BubbleList`** 组件新增 **回到底部按钮**，同时新增 悬停内容区域出现滚动条。增强交互体验
- **`Sender`** 组件新增 **变体**、**底部**、**指令触发功能**。
- 上新 **`MentionSender`** 组件，这是 **`Sender`** 组件另一种**指令**的方式

### 🛠 改进

- **`Sender`** 组件 优化在没有值的情况下的发送按钮的状态为禁用，@submit 方法也会被禁用。

  但是这样就会有一个问题：有这么一个场景，当用户只是上传了一个文件，没有去在输入框中传值，此时的内置发送按钮也是禁用状态，且 @submit 事件也是禁用状态。所以我们决定针对这一情况，新增 `submit-btn-disabled` 属性，提供开发者主动控制。 在特殊场景下，开发者自定义内置发送按钮的禁用启用。(自定义 #action-list 时，此属性对 submit 事件同样生效。)

- **`Sender`** 组件 新增 `input-style` 属性，供开发者自定义内置的输入框样式。

###  📚文档更新

- 更新线上开发计划文档，展示我们陆续的开发计划。有想法提 pr 的伙伴，可以先看看我们的开发计划，有感兴趣的模块，可以进交流群，一起研究推进 **[开发计划](https://element-plus-x.com/roadmap.html)**
- 更新 **`指南文档`**  中的 **[开发文档](https://element-plus-x.com/guide/develop.html)** ，修复文档介绍错误问题

## [v1.1.1] - 2025-04-06

### 💥 破坏性变更

- `Sender`  输入框组件：双向绑定的写法变更。 由之前的 `v-model:value` 变更为 `v-model` 直接绑定

### 🐛 修复

- 修复 `Sender`  输入框组件在 `v-model`  双向绑定失效问题
- 修复 `Typewriter` 打字器组件在 流模式接口输出下，卡顿的问题。
- 修复 `BubbleList` 气泡列表组件，在流式接口输出下，自动滚动失效问题。并将 `BubbleList` 组件，和打字器组件解耦。
- 修复 `BubbleList` 气泡列表组件，`maxWidth` 失效问题。**[issue #46](https://github.com/element-plus-x/Element-Plus-X/issues/46)**

### 🚀 新增功能

- 新增 `Thinking` 思考中组件，和 `ThoughtChain` 思维链组件 ，用于在流式接口输出下，展示思考过程。**[issue #32](https://github.com/element-plus-x/Element-Plus-X/issues/32)**、**[issue #45](https://github.com/element-plus-x/Element-Plus-X/issues/45)**

- 新增 `Welcom` 欢迎组件，方便用户快速集成好看的欢迎介绍卡片

## [v1.0.81] - 2025-03-29

### 🐛 修复

- 修复 `Sender`  输入框组件在 `loading`  状态下，依然可以触发 `@submit`  方法的 bug  **[issue #22](https://github.com/element-plus-x/Element-Plus-X/issues/22)**
- 修复 `Sender` 输入框组件在 `read-only`  状态下，依然可以触发值的修改 的 bug

### 🚀 新增功能

- 新增  `useRecord`  钩子函数，解决用户在自定义 `Sender`  输入框的 `#action-list` 插槽时候，又同时想保留组件内置的 浏览器语音识别 API 方法。可以使用这个 hooks。

- 新增 两个 hooks 钩子函数 ，和一个 工具类。针对 sse 协议的流式请求 ， ` 数据 (渲染层)` + `请求 (控制层)`  进行状态的管理。方便 `Vue`  开发者，在使用流式接口时，方便对请求状态进行处理；方便对需要的数据进行渲染。

  | 钩子函数   | 使用                                                         | 特点             |
  | ---------- | ------------------------------------------------------------ | ---------------- |
  | useXStream | 单独使用：可自动获取流式数据；支持开始流式请求、中断流式请求； | 偏封装，便捷使用 |
  | useSend    | 可单独使用：传入开始和结束方法，返回方法 loading 状态。<br />不支持返回数据，如需对数据和请求状态支持，需要和 **XRequest** 组合使用 | 偏底层，灵活控制 |
  | XRequest   | 可单独使用：配置接口基础地址，使用 send 发送请求，实例上有很多这个请求的状态监听。<br />通过监听事件的回调对数据做处理。一般在项目中和 **useSend** 钩子 组合使用 | 偏底层，灵活控制 |

### 🛠 改进

- 优化兼容性， `Sender` 输入框组件，由于使用 `defineModel` 语法，该语法仅在 **`Vue 3.4+`**  版本中可用，导致较多用户，因 Vue 版本问题，在控制台有报错，现已将此写法改用低版本写法。**(无缝替换，不用更改原写法)**

### 📚 文档更新

- 更新线上开发计划文档，会给大家展示我们陆续的开发计划。有想法提 pr 的伙伴，可以先看看我们的开发计划，有感兴趣的模块，可以进交流群，一起研究推进 **[开发计划](https://element-plus-x.com/roadmap.html)**
- 更新 **`指南文档`**  中的 **[开发文档](https://element-plus-x.com/guide/develop.html)** ，着重修改 **开发命令**、**贡献代码**、**本地调试**  全流程介绍。 规范 `开发` 和 `pr` 提交

## [v1.0.6] - 2025-03-23

### 🛠 改进
- 集成 ESLint 9.x 和 Oxlint，规范开发流程
- 新增打包配置：自动根据组件文件名导出全量/按需组件

### 📚 文档更新
- 完善中/英文文档内容
- 新增文档更新日志模块

## [v0.9.x] - 2025-03-20
### 💥 破坏性变更

- `Typography` 组件：
  - 弃用 `speed` 属性，改用 `step` 属性（与 ant-design-x 对齐）
  - 弃用 `typedjs` 实现打字效果，流式输出失效，且每次流式输出会导致组件重新渲染
- `Bubble` 组件：
  - 弃用 `typing.speed` 属性值，改用 `typing.step`（与 ant-design-x 对齐）

### 🐛 修复

- 修复 `Typography` 打字器组件渲染 bug
- 修复 `Sender` 输入框组件 `autosize` 属性失效 bug

### 🚀 新增功能
- **`Typography`/`Bubble` 组件**：
  - 新增中断输出（`pause`）、继续打字（`resume`）和销毁（`destroy`）实例方法
  - 新增操作监听事件
- **`BubbleList` 组件**：
  - 新增 `trigger-indices` 属性，用于监听指定气泡的 `@complete` 完成回调
- **`Sender` 组件**：
  - 新增 `@recording-change` 事件，监听内置录音按钮点击状态
  - 新增开始录音（`startRecording`）和结束录音（`stopRecording`）实例方法

## [v0.9.x] - 2025-03-14
### 💥 破坏性变更

- `Typography` 组件：
  - 弃用 `step` 属性，改用 `speed` 属性控制打字速度
- `Bubble` 组件：
  - 弃用 `typing.step` 属性值，改用 `typing.speed` 控制打字速度

### 🐛 修复

- 修复 `Typography` 打字器组件渲染 bug

### 🚀 新增功能
- **`Bubble` 组件**：
  - 新增 `avatar-size` 和 `avatar-gap` 属性，控制无头像时的气泡样式
