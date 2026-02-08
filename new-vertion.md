这是我的组件库，其中 apps 中是 docs 文档，用的是 vitepress 搭建的，，其中的 packages 中是组件源码和 storybook 演示文档。
两个文档目的就是为了一个是本地写完组件后，可以直接看到效果走自测用，还有就是可以打包演示用。一个是为了发版后 更新相关组件说明。

关于组件库的原始组件的升级，我也想做一个新版本的升级处理

- 组件库升级
  1. xmarkdown 组件我们现在分了一个新的组件出去，https://github.com/element-plus-x/x-markdown 这是分出的地址，一些issue和pr会在这个库上及时优化。原来放在一起会导致组件包稍微有点大，我看 ant-design-x 组件库也拆出来了。https://github.com/ant-design/x 这是他们的组件库地址。
  2. 输入框组件我希望合并成一个，就是合并到 EditorSender 去，现在编辑发送框的很多功能都太重复了，维护起来太笨重了。直接使用 EditorSender 就好了。
  3. 还有打字器组件的雾化， 也会做到 xmd 里面。打字器的 拟流式 应该会抽成一个 hooks 搭配 xmd 使用。
  4. 还有 BubbleList 会小重构。

我现在想做好 开发环境中的升级，和基建工作。
以下是我希望实现的效果：

- 我想升级一下这两个文档所依赖的包。但并不想影响到组件库最低兼容的 vue3+ 版本。（基建）
- 后面我想让我的组件库经过新版本升级后，底层慢慢就不再依赖 element-plus 组件，而是单独的一套组件库
- 我希望升级后的组件，每个组件都集成对应的 主题系统，可以通过设置前缀属性，透传给每个组件的类名。这样方便做样式隔离，和用户自定义类名的操作，这个和 element-plus 组件一样。https://github.com/element-plus/element-plus 这是 element-plus 组件库地址
- 我还希望组件库有很好的版本管理，包括大版本文档的版本管理，现在我们还在 1版本，后续 2版本，我不知道其他开源组件库是怎么做的版本的控制的。vitepresss 版本和 storybook 应该有说明吧 （版本管理）
- 文档相关-我希望实现每个组件都有对应的信息展示：1. 展示这个组件的更新日志按钮，点击可以从右侧抽屉看到更新的日志 2. 展示这个组件的 issue 相关的信息，有多少 issue 没关闭，还有多少 issue 关闭了
  这个和腾讯的组件库做的那种一样
  饿了么的 https://github.com/element-plus/element-plus 和 腾讯的 https://github.com/Tencent/tdesign-vue 组件库，还有 https://github.com/ant-design/x 都有我觉得不错的组件库管理的地方。以上相关的优化，我都是从这些大厂开源的组件库找的，感觉不错的地方。
