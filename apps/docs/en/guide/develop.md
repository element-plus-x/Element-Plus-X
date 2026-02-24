#### **I. Clone Repository**

```bash
git clone https://github.com/element-plus-x/Element-Plus-X.git
cd Element-Plus-X
```

#### **II. Install Dependencies**

```bash
pnpm install
```

#### **III. Project Structure**

```plaintext
   ├── apps\docs              # Documentation
   |     └── components       # Component library documentation
   └── packages\core          # Core code
         └── src
            ├── components    # Component source code
            └── stories       # Component demo examples

```

#### **IV. Common Commands**

Before starting the docs for the first time, build core to make sure `dist/types` are generated.

| Command           | Description                                |
| ----------------- | ------------------------------------------ |
| `pnpm build:core` | Build core (first run / before publishing) |
| `pnpm dev:core`   | Start core Storybook                       |
| `pnpm dev:docs`   | Start documentation site                   |

#### **V. Contributing**

Before opening a PR, we recommend discussing the requirement and proposal in the discussion group or an Issue to avoid duplicated work.

1. **Create your own branch**:
   - Create a feature branch based on `dev`
   - PR base branch: `dev`

   ```bash
   git checkout dev
   git checkout -b feature/your-branch
   ```

2. **Code Standards**:

   We recommend enabling the `ESLint` extension in VS Code to auto check and fix on save.
   - Component naming follows `PascalCase` convention

   - Each component includes:

   ```plaintext
   ├── components      # Sub-components involved in the component (optional)
   ├── index.vue       # Component implementation
   ├── types.d.ts      # Type definitions
   └── style.scss      # Style files
   ```

3. **Submit PR**:
   - Title format: `feat(component): Add XXX component`
   - Description should include: background & goal, key changes, scope/impact, and verification

#### **VI. Debug Local Package**

Link local code in the example project:

```bash
pnpm build:core
pnpm dev:docs
```

#### **VII. Common Issues**

1. **Style Conflicts**:
   - Avoid importing Element Plus styles multiple times
   - Use `deep()` for targeted overrides when necessary
2. **Version Issues**:
   - Node ≥ 18, Vue ≥ 3.3, pnpm ≥ 10
