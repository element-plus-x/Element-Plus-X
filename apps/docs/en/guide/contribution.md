# Contribution Guide

Thank you for your interest in Element-Plus-X! This document will help you understand how to properly submit code and PRs.

## 1. Commit Convention

### Format (Strict Compliance Required)

```
<type>(<scope>): <subject> [#issue]
```

### Type Reference

| Type     | Emoji | Description                          |
| -------- | ----- | ------------------------------------ |
| feat     | 🚀    | New feature                          |
| fix      | 🐛    | Bug fix                              |
| docs     | 📚    | Documentation update                 |
| style    | 💄    | Code style (no functionality change) |
| refactor | ♻️    | Code refactoring                     |
| perf     | ⚡    | Performance improvement              |
| test     | ✅    | Testing                              |
| build    | 📦    | Build related                        |
| ci       | 👷    | CI/CD                                |
| chore    | 🔧    | Other changes                        |
| revert   | ⏪    | Revert changes                       |
| breaking | 💥    | Breaking change                      |

### Scope (Component Reference)

| Scope          | Component      | Description                  |
| -------------- | -------------- | ---------------------------- |
| Bubble         | Bubble         | Bubble component             |
| BubbleList     | BubbleList     | Bubble list component        |
| XSender        | XSender        | Input component              |
| Sender         | Sender         | Input component (deprecated) |
| MentionSender  | MentionSender  | Mention input component      |
| Thinking       | Thinking       | Thinking component           |
| ThoughtChain   | ThoughtChain   | Thought chain component      |
| Welcome        | Welcome        | Welcome component            |
| Prompts        | Prompts        | Prompts component            |
| Conversations  | Conversations  | Conversations component      |
| FilesCard      | FilesCard      | Files card component         |
| Attachments    | Attachments    | Attachments component        |
| ConfigProvider | ConfigProvider | Global config component      |
| Typewriter     | Typewriter     | Typewriter component         |
| XMarkdown      | XMarkdown      | Markdown renderer component  |
| useRecord      | useRecord      | useRecord Hook               |
| useXStream     | useXStream     | useXStream Hook              |
| useSend        | useSend        | useSend Hook                 |
| XRequest       | XRequest       | XRequest utility             |

### Correct Examples

```bash
# New feature
feat(Bubble): add maxWidth property

# Bug fix with Issue reference
fix(Sender): fix v-model binding issue #22

# Documentation update (no scope)
docs: update development guide

# Breaking change
breaking(Bubble): remove typing property

# Performance improvement
perf(BubbleList): optimize rendering performance for large data
```

### Incorrect Examples

```bash
# ❌ Non-compliant, will be categorized as "Chore"
fixed a bug
new feature
update docs
Bubble fixed issue
```

::: warning Important
Non-compliant commits will be automatically categorized as "Chore" and won't display correctly in the changelog. Please strictly follow the commit format!
:::

## 2. PR Convention

### PR Title Format

```
[<scope>] <type>: <subject>
```

### Correct Examples

```bash
[Bubble] fix: fix maxWidth property issue
[XSender] feat: add submit-btn-disabled property
[docs] update: update theme configuration docs
```

### PR Body Template

When creating a PR, please include the following:

```markdown
## Description

<!-- Brief description of the changes -->

## Related Issue

Closes #xx

## Change Type

- [ ] 🚀 New feature (feat)
- [ ] 🐛 Bug fix (fix)
- [ ] 📚 Documentation update (docs)
- [ ] ♻️ Code refactoring (refactor)
- [ ] ⚡ Performance improvement (perf)
- [ ] 💥 Breaking change (breaking)
- [ ] 🔧 Other changes (chore)

## Screenshots

<!-- Add screenshots if applicable -->

## Checklist

- [ ] Code passes ESLint checks
- [ ] Documentation has been updated
- [ ] Tests have been added/updated
```

## 3. Changelog Information

### Auto-generation Mechanism

The project's changelog is automatically generated from commit messages:

1. **Commit Code** → Submit commit with proper format
2. **Release/Build** → Script automatically parses commits
3. **Generate Log** → Update `changelog.json` and display on docs site

### Data Sources

| Source             | Description                                                               |
| ------------------ | ------------------------------------------------------------------------- |
| Manual Log         | `apps/docs/en/update-log.md` - Detailed changelog for historical versions |
| Auto-generated Log | Automatically parsed from git commits                                     |

### Display Effect

The changelog will be displayed on the docs site's "Changelog" page, including:

- Version number and release date
- Change type (with emoji and label)
- Change description
- Related Issue links

::: tip Note
Please follow the convention strictly, otherwise changes won't be categorized correctly and will affect the changelog display.
:::

## 4. Development Workflow

### 1. Fork and Clone Repository

```bash
git clone https://github.com/your-username/Element-Plus-X.git
cd Element-Plus-X
pnpm install
```

### 2. Create Branch

```bash
git checkout -b fix/bubble-maxwidth
```

### 3. Develop and Commit

```bash
# Development...
git add .
git commit -m "fix(Bubble): fix maxWidth property issue #46"
```

### 4. Push and Create PR

```bash
git push origin fix/bubble-maxwidth
```

Then create a Pull Request on GitHub.

## 5. FAQ

### Q: My commit wasn't categorized correctly, what should I do?

A: Make sure your commit message follows the `<type>(<scope>): <subject>` format. Non-compliant commits will be categorized as "Chore".

### Q: How to link multiple Issues?

A: Use space-separated Issue numbers in your commit message:

```bash
fix(Bubble): fix maxWidth issue #46 #47
```

### Q: What if my PR is rejected?

A: Please check:

1. Does the commit message follow the convention?
2. Does the code pass ESLint checks?
3. Have you updated relevant documentation?
4. Have you added necessary test cases?
