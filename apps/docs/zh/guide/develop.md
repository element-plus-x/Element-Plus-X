#### **一、克隆仓库**

```bash
git clone https://github.com/element-plus-x/Element-Plus-X.git
cd Element-Plus-X
```

#### **二、安装依赖**

```bash
pnpm install
```

#### **三、项目结构**

```plaintext
   ├── apps\docs              # 文档
   |     └── components       # 组件库文档
   └── packages\core          # 核心代码
         └── src
            ├── components    # 组件源码
            └── stories       # 组件演示用例

```

#### **四、常用命令**

首次启动文档前，建议先构建 core（确保 dist/types 已生成）。

| 命令              | 说明                         |
| ----------------- | ---------------------------- |
| `pnpm build:core` | 构建 core（首次启动/发布前） |
| `pnpm dev:core`   | 启动 core 的 Storybook       |
| `pnpm dev:docs`   | 启动文档站点                 |

#### **五、贡献指南**

提交 PR 前，建议先在交流群或 Issue 中沟通需求与方案，避免重复劳动。

1. **创建一个自己的分支**：
   - 基于 `dev` 分支创建功能分支
   - PR 目标分支：`dev`

   ```bash
   git checkout dev
   git checkout -b feature/your-branch
   ```

2. **代码规范**：

   建议安装并启用 VS Code 的 `ESLint` 插件，保存时自动检查与修复。
   - 组件命名遵循 `PascalCase` 规范

   - 每个组件包含：

   ```plaintext
   ├── components      # 组件涉及到的子组件 （可选）
   ├── index.vue       # 组件实现
   ├── types.d.ts      # 类型定义
   └── style.scss      # 样式文件
   ```

3. **提交 PR**：
   - 标题格式：`feat(component): 新增 XXX 组件`
   - 描述建议包含：背景与目标、实现要点、影响范围与验证方式

#### **六、调试本地包**

在示例项目中链接本地代码：

```bash
pnpm build:core
pnpm dev:docs
```

#### 七、**常见问题**

1. **样式冲突**：
   - 避免重复引入 Element Plus 样式
   - 必要时使用 `deep()` 定向覆盖组件内部样式
2. **版本问题**：
   - Node ≥ 18、Vue ≥ 3.3、pnpm ≥ 10
