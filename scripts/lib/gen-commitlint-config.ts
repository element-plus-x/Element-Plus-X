import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { COMMIT_TYPES, getCommitScopes, TYPE_ENUM } from '../../configs/index';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..', '..');

const TYPES_PROMPT = COMMIT_TYPES.map(t => ({
  value: t.type,
  name: `${t.type}:     ${t.emoji} ${t.zhLabel}     | ${t.enLabel}`
}));

const scopes = getCommitScopes();

const configContent = `// 自动生成 - 请勿手动修改
// 配置来源: configs/index.ts
// 运行 pnpm gen:commitlint 重新生成

const TYPE_ENUM = ${JSON.stringify(TYPE_ENUM)};

const TYPES_PROMPT = ${JSON.stringify(TYPES_PROMPT, null, 2)};

const SCOPES = ${JSON.stringify(scopes, null, 2)};

module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [2, 'always', TYPE_ENUM]
  },
  prompt: {
    alias: { fd: 'docs: fix typos' },
    messages: {
      type: '选择你要提交的类型 | Select the type of change that you\\'re committing:',
      scope: '选择一个提交范围（可选）| Denote the SCOPE of this change (optional):',
      customScope: '请输入自定义的提交范围 | Denote the SCOPE of this change:',
      subject: '填写简短精炼的变更描述 | Write a SHORT, IMPERATIVE tense description of the change:\\n',
      body: '填写更加详细的变更描述（可选）。使用 "|" 换行 | Provide a LONGER description of the change (optional). Use "|" to break new line:\\n',
      breaking: '列举非兼容性重大的变更（可选）。使用 "|" 换行 | List any BREAKING CHANGES (optional). Use "|" to break new line:\\n',
      footerPrefixesSelect: '选择关联issue前缀（可选）| Select the ISSUES type of changeList by this change (optional):',
      customFooterPrefix: '输入自定义issue前缀 | Input ISSUES prefix:',
      footer: '列举关联issue (可选) 例如: #31, #I3244 | List any ISSUES by this change. E.g.: #31, #34:\\n',
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
`;

const outputPath = path.join(rootDir, '.commitlintrc.cjs');
fs.writeFileSync(outputPath, configContent, 'utf-8');

console.log('✅ 已生成 .commitlintrc.cjs');
console.log(`   组件数量: ${scopes.length - 2} (不含 docs/core)`);
console.log(`   提交类型: ${TYPE_ENUM.length}`);
