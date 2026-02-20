#### **I. Clone Repository**

```bash
git clone https://github.com/HeJiaYue520/Element-Plus-X.git
cd Element-Plus-X
```

#### **II. Install Dependencies**

**Recommended to use PNPM for dependency management**

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

#### **IV. Development Commands**

**Please build the components first before previewing**

| Command         | Description                                    |
| --------------- | ---------------------------------------------- |
| `pnpm build`    | Build production version locally               |
| `pnpm dev:core` | Start component testing with storybook preview |
| `pnpm dev:docs` | Local documentation preview                    |

#### **V. Become a Contributor**

> 🥰 Before submitting a PR, we really hope and welcome you to join our discussion group.
>
> 😔 To avoid wasting your precious time. Please first communicate and discuss in the discussion group, get in touch with our team project leader, exchange ideas together, determine the features you want to work on, and clarify the requirements.
>
> 💌 After submitting a PR, we can exchange ideas and learn from each other. Pool our wisdom to improve the PR solution and progress together. Looking forward to your participation

1. **Create your own branch**:

   Branch management is particularly important. We decided to use the main branch as the production branch, and all our PR submissions will be merged into the dev development branch. After creating a PR, we will first check which PRs are more useful. When we approve your submission, we will create a new branch for you and merge your code into that branch. At the same time, we will pull the code and run local reviews. If there are areas that need improvement, we will provide feedback to you in a timely manner. If our review doesn't pass, we will also provide relevant suggestions. Please feel free to submit your ideas and creativity.

   ```bash
   git checkout -b feature/new-component (new-component is your branch name)
   ```

2. **Code Standards**:

   After executing the development commands, please install and open **VS Code's `ESLint` plugin** and use `ESLint.9x` to format code (automatic checking when saving code)
   - Component naming follows `PascalCase` convention

   - Each component includes:

   ```plaintext
   ├── components      # Sub-components involved in the component (optional)
   ├── index.vue       # Component implementation
   ├── types.d.ts      # Type definitions
   └── style.scss      # Style files
   ```

3. **Submit PR**:
   - Title format: `feat(component): Add new component`
   - Description includes: feature description, usage examples, change impact

4. **Review Process**:

   🙋 Reminder again: We will first check which PRs are effective. When we approve your submission, we will create a new branch for you and merge your code into that branch. At the same time, we will pull the code and run local reviews. If there are areas that need improvement, we will provide feedback to you in a timely manner. If our review doesn't pass, we will also provide relevant suggestions. Please feel free to submit your ideas and creativity.

#### **VI. Debug Local Package**

Link local code in the example project:

```bash
# Build locally first
pnpm build

# Execute in example project
pnpm run dev:core
```

#### **VII. Common Issues**

1. **Style Conflicts**:
   - Ensure no duplicate Element-Plus style imports
   - Use `deep()` selector to override component styles
2. **Type Errors**:
   - None at the moment
3. **Voice Function Issues**:
   - Check browser permission settings

4. **Version Issues**:

   Vue version too low, please upgrade to Vue 3.3+ or latest version

   pnpm version too low, please upgrade to 10+ or latest version
