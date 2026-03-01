# 贡献指南

感谢你对 Element-Plus-X 的关注！本文档将帮助你了解如何正确地提交代码和 PR。

## 一、Commit 提交规范

### 格式（严格遵守）

```
<type>(<scope>): <subject> [#issue]
```

### 类型说明

| 类型     | Emoji | 说明                   |
| -------- | ----- | ---------------------- |
| feat     | 🚀    | 新增功能               |
| fix      | 🐛    | 修复缺陷               |
| docs     | 📚    | 文档更新               |
| style    | 💄    | 代码格式（不影响功能） |
| refactor | ♻️    | 代码重构               |
| perf     | ⚡    | 性能优化               |
| test     | ✅    | 测试相关               |
| build    | 📦    | 构建相关               |
| ci       | 👷    | CI/CD                  |
| chore    | 🔧    | 其他修改               |
| revert   | ⏪    | 回退代码               |
| breaking | 💥    | 破坏性变更             |

### Scope（组件范围）

| Scope          | 组件名称     | 说明                 |
| -------------- | ------------ | -------------------- |
| Bubble         | 对话气泡     | 气泡组件             |
| BubbleList     | 气泡列表     | 气泡列表组件         |
| XSender        | 输入框       | 输入框组件           |
| Sender         | 输入框       | 输入框组件（已废弃） |
| MentionSender  | 指令输入框   | 指令输入框组件       |
| Thinking       | 思考中       | 思考中组件           |
| ThoughtChain   | 思维链       | 思维链组件           |
| Welcome        | 欢迎         | 欢迎组件             |
| Prompts        | 提示集       | 提示集组件           |
| Conversations  | 会话管理     | 会话管理组件         |
| FilesCard      | 文件卡片     | 文件卡片组件         |
| Attachments    | 附件上传     | 附件上传组件         |
| ConfigProvider | 全局配置     | 全局配置组件         |
| Typewriter     | 打字器       | 打字器组件           |
| XMarkdown      | Markdown渲染 | Markdown渲染组件     |
| useRecord      | 录音钩子     | useRecord Hook       |
| useXStream     | 流式请求钩子 | useXStream Hook      |
| useSend        | 发送钩子     | useSend Hook         |
| XRequest       | 请求工具类   | XRequest 工具类      |

### 正确示例

```bash
# 新增功能
feat(Bubble): 新增 maxWidth 属性

# 修复缺陷并关联 Issue
fix(Sender): 修复 v-model 双向绑定问题 #22

# 文档更新（无 scope）
docs: 更新开发文档

# 破坏性变更
breaking(Bubble): 移除 typing 属性

# 性能优化
perf(BubbleList): 优化大量数据渲染性能
```

### 错误示例

```bash
# ❌ 不符合规范，会被归类为杂项
修复了一个bug
新增功能
更新文档
Bubble 修复了问题
```

::: warning 重要提示
不符合规范的提交会被自动归类为「杂项」类型，无法正确展示在更新日志中。请务必严格遵守提交格式！
:::

## 二、PR 提交规范

### PR Title 格式

```
[<scope>] <type>: <subject>
```

### 正确示例

```bash
[Bubble] fix: 修复 maxWidth 属性失效问题
[XSender] feat: 新增 submit-btn-disabled 属性
[docs] update: 更新主题配置文档
```

### PR Body 模板

创建 PR 时，请确保包含以下内容：

```markdown
## 变更说明

<!-- 简要描述本次变更的内容 -->

## 关联 Issue

Closes #xx

## 变更类型

- [ ] 🚀 新增功能 (feat)
- [ ] 🐛 修复缺陷 (fix)
- [ ] 📚 文档更新 (docs)
- [ ] ♻️ 代码重构 (refactor)
- [ ] ⚡ 性能优化 (perf)
- [ ] 💥 破坏性变更 (breaking)
- [ ] 🔧 其他修改 (chore)

## 截图

<!-- 如适用，请添加截图 -->

## 检查清单

- [ ] 代码已通过 ESLint 检查
- [ ] 已更新相关文档
- [ ] 已添加/更新测试用例
```

## 三、更新日志说明

### 自动生成机制

项目的更新日志会从 commit 信息自动生成：

1. **提交代码** → 按规范格式提交 commit
2. **发版/构建** → 自动执行脚本解析 commits
3. **生成日志** → 更新 `changelog.json` 并展示在文档站点

### 数据来源

| 来源         | 说明                                                  |
| ------------ | ----------------------------------------------------- |
| 手动维护日志 | `apps/docs/zh/update-log.md` - 历史版本的详细更新日志 |
| 自动生成日志 | 从 git commits 自动解析生成                           |

### 展示效果

更新日志会在文档站点的「更新日志」页面展示，包括：

- 版本号和发布日期
- 变更类型（带 emoji 和标签）
- 变更描述
- 关联的 Issue 链接

::: tip 提示
请务必按规范提交，否则变更不会正确归类，影响更新日志的展示效果。
:::

## 四、开发流程

### 1. Fork 并克隆仓库

```bash
git clone https://github.com/your-username/Element-Plus-X.git
cd Element-Plus-X
pnpm install
```

### 2. 创建分支

```bash
git checkout -b fix/bubble-maxwidth
```

### 3. 开发并提交

```bash
# 开发...
git add .
git commit -m "fix(Bubble): 修复 maxWidth 属性失效问题 #46"
```

### 4. 推送并创建 PR

```bash
git push origin fix/bubble-maxwidth
```

然后在 GitHub 上创建 Pull Request。

## 五、常见问题

### Q: 我的提交没有正确归类怎么办？

A: 请确保你的 commit message 符合 `<type>(<scope>): <subject>` 格式。不符合规范的提交会被归类为「杂项」。

### Q: 如何关联多个 Issue？

A: 在 commit message 中使用空格分隔多个 Issue 编号：

```bash
fix(Bubble): 修复 maxWidth 问题 #46 #47
```

### Q: PR 被拒绝怎么办？

A: 请检查：

1. commit message 是否符合规范
2. 代码是否通过 ESLint 检查
3. 是否更新了相关文档
4. 是否添加了必要的测试用例
