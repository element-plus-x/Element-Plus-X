// .commitlintrc.js
// 注意：类型定义需要与 configs/commit-types.ts 保持同步
// Note: Type definitions must be kept in sync with configs/commit-types.ts
/** @type {import('cz-git').UserConfig} */

const COMMIT_TYPES = [
  { type: 'feat', emoji: '🚀', zhLabel: '新增功能', enLabel: 'A new feature' },
  { type: 'fix', emoji: '🐛', zhLabel: '修复缺陷', enLabel: 'A bug fix' },
  { type: 'docs', emoji: '📚', zhLabel: '文档更新', enLabel: 'Documentation only changes' },
  { type: 'style', emoji: '💄', zhLabel: '代码格式', enLabel: 'Changes that do not affect the meaning of the code' },
  { type: 'refactor', emoji: '♻️', zhLabel: '代码重构', enLabel: 'A code change that neither fixes a bug nor adds a feature' },
  { type: 'perf', emoji: '⚡', zhLabel: '性能优化', enLabel: 'A code change that improves performance' },
  { type: 'test', emoji: '✅', zhLabel: '测试相关', enLabel: 'Adding missing tests or correcting existing tests' },
  { type: 'build', emoji: '📦', zhLabel: '构建相关', enLabel: 'Changes that affect the build system or external dependencies' },
  { type: 'ci', emoji: '👷', zhLabel: 'CI 配置', enLabel: 'Changes to our CI configuration files and scripts' },
  { type: 'chore', emoji: '🔧', zhLabel: '其他修改', enLabel: 'Other changes that do not modify src or test files' },
  { type: 'revert', emoji: '⏪', zhLabel: '回退代码', enLabel: 'Revert to a commit' },
  { type: 'breaking', emoji: '💥', zhLabel: '破坏性变更', enLabel: 'Breaking changes' }
];

const TYPE_ENUM = COMMIT_TYPES.map(t => t.type);

const TYPES_PROMPT = COMMIT_TYPES.map(t => ({
  value: t.type,
  name: `${t.type}:     ${t.emoji} ${t.zhLabel}     | ${t.enLabel}`
}));

module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    // @see: https://commitlint.js.org/#/reference-rules
    'type-enum': [
      2,
      'always',
      TYPE_ENUM
    ],
  },
  prompt: {
    alias: { fd: 'docs: fix typos' },
    messages: {
      type: '选择你要提交的类型 | Select the type of change that you\'re committing:',
      scope:
        '选择一个提交范围（可选）| Denote the SCOPE of this change (optional):',
      customScope: '请输入自定义的提交范围 | Denote the SCOPE of this change:',
      subject:
        '填写简短精炼的变更描述 | Write a SHORT, IMPERATIVE tense description of the change:\n',
      body: '填写更加详细的变更描述（可选）。使用 "|" 换行 | Provide a LONGER description of the change (optional). Use "|" to break new line:\n',
      breaking:
        '列举非兼容性重大的变更（可选）。使用 "|" 换行 | List any BREAKING CHANGES (optional). Use "|" to break new line:\n',
      footerPrefixesSelect:
        '选择关联issue前缀（可选）| Select the ISSUES type of changeList by this change (optional):',
      customFooterPrefix: '输入自定义issue前缀 | Input ISSUES prefix:',
      footer:
        '列举关联issue (可选) 例如: #31, #I3244 | List any ISSUES by this change. E.g.: #31, #34:\n',
      confirmCommit:
        '是否提交或修改commit ? | Are you sure you want to proceed with the commit above?',
    },
    types: TYPES_PROMPT,
    useEmoji: false,
    emojiAlign: 'center',
    useAI: false,
    aiNumber: 1,
    themeColorCode: '',
    scopes: [
      { value: 'Bubble', name: 'Bubble:       对话气泡组件' },
      { value: 'BubbleList', name: 'BubbleList:   气泡列表组件' },
      { value: 'XSender', name: 'XSender:      输入框组件' },
      { value: 'Thinking', name: 'Thinking:     思考中组件' },
      { value: 'ThoughtChain', name: 'ThoughtChain: 思维链组件' },
      { value: 'Welcome', name: 'Welcome:      欢迎组件' },
      { value: 'Prompts', name: 'Prompts:      提示集组件' },
      { value: 'Conversations', name: 'Conversations: 会话管理组件' },
      { value: 'FilesCard', name: 'FilesCard:    文件卡片组件' },
      { value: 'Attachments', name: 'Attachments:  附件上传组件' },
      { value: 'ConfigProvider', name: 'ConfigProvider: 全局配置组件' },
      { value: 'hooks', name: 'hooks:        钩子函数' },
      { value: 'docs', name: 'docs:         文档' },
      { value: 'core', name: 'core:         核心包' },
    ],
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
      // 如果使用 gitee 作为开发管理
      { value: 'link', name: 'link:     链接 ISSUES 进行中' },
      { value: 'closed', name: 'closed:   标记 ISSUES 已完成' },
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
    defaultSubject: '',
  },
};
