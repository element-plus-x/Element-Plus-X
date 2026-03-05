// 自动生成 - 请勿手动修改
// 配置来源: configs/index.ts
// 运行 pnpm gen:commitlint 重新生成

const TYPE_ENUM = ["feat","fix","docs","style","refactor","perf","test","build","ci","chore","revert","breaking"];

const TYPES_PROMPT = [
  {
    "value": "feat",
    "name": "feat:     🚀 新增     | Feature"
  },
  {
    "value": "fix",
    "name": "fix:     🐛 修复     | Fix"
  },
  {
    "value": "docs",
    "name": "docs:     📚 文档     | Docs"
  },
  {
    "value": "style",
    "name": "style:     💄 样式     | Style"
  },
  {
    "value": "refactor",
    "name": "refactor:     ♻️ 重构     | Refactor"
  },
  {
    "value": "perf",
    "name": "perf:     ⚡ 性能     | Perf"
  },
  {
    "value": "test",
    "name": "test:     ✅ 测试     | Test"
  },
  {
    "value": "build",
    "name": "build:     📦 构建     | Build"
  },
  {
    "value": "ci",
    "name": "ci:     👷 CI     | CI"
  },
  {
    "value": "chore",
    "name": "chore:     🔧 杂项     | Chore"
  },
  {
    "value": "revert",
    "name": "revert:     ⏪ 回退     | Revert"
  },
  {
    "value": "breaking",
    "name": "breaking:     💥 破坏性     | Breaking"
  }
];

const SCOPES = [
  {
    "value": "XSender",
    "name": "XSender: 组件"
  },
  {
    "value": "XMarkdown",
    "name": "XMarkdown: 组件"
  },
  {
    "value": "ConfigProvider",
    "name": "ConfigProvider: 组件"
  },
  {
    "value": "Bubble",
    "name": "Bubble: 组件"
  },
  {
    "value": "BubbleList",
    "name": "BubbleList: 组件"
  },
  {
    "value": "Conversations",
    "name": "Conversations: 组件"
  },
  {
    "value": "Welcome",
    "name": "Welcome: 组件"
  },
  {
    "value": "Prompts",
    "name": "Prompts: 组件"
  },
  {
    "value": "FilesCard",
    "name": "FilesCard: 组件"
  },
  {
    "value": "Attachments",
    "name": "Attachments: 组件"
  },
  {
    "value": "Thinking",
    "name": "Thinking: 组件"
  },
  {
    "value": "ThoughtChain",
    "name": "ThoughtChain: 组件"
  },
  {
    "value": "useRecord",
    "name": "useRecord: 钩子函数"
  },
  {
    "value": "useXStream",
    "name": "useXStream: 钩子函数"
  },
  {
    "value": "useSend",
    "name": "useSend: 钩子函数"
  },
  {
    "value": "docs",
    "name": "docs: 文档"
  },
  {
    "value": "core",
    "name": "core: 核心包"
  }
];

module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [2, 'always', TYPE_ENUM]
  },
  prompt: {
    alias: { fd: 'docs: fix typos' },
    messages: {
      type: '选择你要提交的类型 | Select the type of change that you\'re committing:',
      scope: '选择一个提交范围（可选）| Denote the SCOPE of this change (optional):',
      customScope: '请输入自定义的提交范围 | Denote the SCOPE of this change:',
      subject: '填写简短精炼的变更描述 | Write a SHORT, IMPERATIVE tense description of the change:\n',
      body: '填写更加详细的变更描述（可选）。使用 "|" 换行 | Provide a LONGER description of the change (optional). Use "|" to break new line:\n',
      breaking: '列举非兼容性重大的变更（可选）。使用 "|" 换行 | List any BREAKING CHANGES (optional). Use "|" to break new line:\n',
      footerPrefixesSelect: '选择关联issue前缀（可选）| Select the ISSUES type of changeList by this change (optional):',
      customFooterPrefix: '输入自定义issue前缀 | Input ISSUES prefix:',
      footer: '列举关联issue (可选) 例如: #31, #I3244 | List any ISSUES by this change. E.g.: #31, #34:\n',
      confirmCommit: '是否提交或修改commit ? | Are you sure you want to proceed with the commit above?'
    },
    types: TYPES_PROMPT,
    useEmoji: false,
    emojiAlign: 'center',
    useAI: false,
    aiNumber: 1,
    themeColorCode: '',
    scopes: SCOPES,
    allowCustomScopes: true,
    allowEmptyScopes: true,
    customScopesAlign: 'bottom',
    customScopesAlias: 'custom',
    emptyScopesAlias: 'empty',
    upperCaseSubject: false,
    markBreakingChangeMode: false,
    allowBreakingChanges: ['feat', 'fix'],
    breaklineNumber: 100,
    breaklineChar: '|',
    skipQuestions: [],
    issuePrefixes: [
      { value: 'link', name: 'link:     链接 ISSUES 进行中' },
      { value: 'closed', name: 'closed:   标记 ISSUES 已完成' }
    ],
    customIssuePrefixAlign: 'top',
    emptyIssuePrefixAlias: 'skip',
    customIssuePrefixAlias: 'custom',
    allowCustomIssuePrefix: true,
    allowEmptyIssuePrefix: true,
    confirmColorize: true,
    scopeOverrides: undefined,
    defaultBody: '',
    defaultIssues: '',
    defaultScope: '',
    defaultSubject: ''
  }
};
