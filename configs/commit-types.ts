export interface CommitTypeConfig {
  type: string;
  emoji: string;
  zhLabel: string;
  enLabel: string;
  color: string;
  bgColor: string;
  borderColor: string;
  description: string;
  descriptionZh: string;
  aliases?: string[];
  issueLabel: string;
}

export const COMMIT_TYPES: CommitTypeConfig[] = [
  {
    type: 'feat',
    emoji: '🚀',
    zhLabel: '新增',
    enLabel: 'Feature',
    color: '#1890ff',
    bgColor: '#e6f4ff',
    borderColor: '#91caff',
    description: 'A new feature',
    descriptionZh: '新增功能',
    aliases: ['feature'],
    issueLabel: '🚀 feat: 新增功能'
  },
  {
    type: 'fix',
    emoji: '🐛',
    zhLabel: '修复',
    enLabel: 'Fix',
    color: '#52c41a',
    bgColor: '#f6ffed',
    borderColor: '#b7eb8f',
    description: 'A bug fix',
    descriptionZh: '修复缺陷',
    issueLabel: '🐛 fix: 修复缺陷'
  },
  {
    type: 'docs',
    emoji: '📚',
    zhLabel: '文档',
    enLabel: 'Docs',
    color: '#722ed1',
    bgColor: '#f9f0ff',
    borderColor: '#d3adf7',
    description: 'Documentation only changes',
    descriptionZh: '文档更新',
    issueLabel: '📚 docs: 文档更新'
  },
  {
    type: 'style',
    emoji: '💄',
    zhLabel: '样式',
    enLabel: 'Style',
    color: '#eb2f96',
    bgColor: '#fff0f6',
    borderColor: '#ffadd2',
    description: 'Code style changes (formatting, semicolons, etc)',
    descriptionZh: '代码格式（不影响逻辑）',
    issueLabel: '💄 style: 代码格式'
  },
  {
    type: 'refactor',
    emoji: '♻️',
    zhLabel: '重构',
    enLabel: 'Refactor',
    color: '#fa8c16',
    bgColor: '#fff7e6',
    borderColor: '#ffd591',
    description: 'Code refactoring',
    descriptionZh: '代码重构',
    issueLabel: '♻️ refactor: 代码重构'
  },
  {
    type: 'perf',
    emoji: '⚡',
    zhLabel: '性能',
    enLabel: 'Perf',
    color: '#13c2c2',
    bgColor: '#e6fffb',
    borderColor: '#87e8de',
    description: 'Performance improvements',
    descriptionZh: '性能优化',
    issueLabel: '⚡ perf: 性能优化'
  },
  {
    type: 'test',
    emoji: '✅',
    zhLabel: '测试',
    enLabel: 'Test',
    color: '#2f54eb',
    bgColor: '#f0f5ff',
    borderColor: '#adc6ff',
    description: 'Adding or updating tests',
    descriptionZh: '测试相关',
    issueLabel: '✅ test: 测试相关'
  },
  {
    type: 'build',
    emoji: '📦',
    zhLabel: '构建',
    enLabel: 'Build',
    color: '#595959',
    bgColor: '#fafafa',
    borderColor: '#d9d9d9',
    description: 'Build system changes',
    descriptionZh: '构建相关',
    issueLabel: '📦 build: 构建相关'
  },
  {
    type: 'ci',
    emoji: '👷',
    zhLabel: 'CI',
    enLabel: 'CI',
    color: '#434958',
    bgColor: '#f3f4f6',
    borderColor: '#c4c7cc',
    description: 'CI configuration changes',
    descriptionZh: 'CI 配置',
    issueLabel: '👷 ci: 持续集成'
  },
  {
    type: 'chore',
    emoji: '🔧',
    zhLabel: '杂项',
    enLabel: 'Chore',
    color: '#8c8c8c',
    bgColor: '#fafafa',
    borderColor: '#d9d9d9',
    description: 'Other changes that do not modify src or test files',
    descriptionZh: '其他修改',
    issueLabel: '🔧 chore: 其他修改'
  },
  {
    type: 'revert',
    emoji: '⏪',
    zhLabel: '回退',
    enLabel: 'Revert',
    color: '#f5222d',
    bgColor: '#fff1f0',
    borderColor: '#ffa39e',
    description: 'Revert changes',
    descriptionZh: '回退代码',
    issueLabel: '⏪ revert: 回退代码'
  },
  {
    type: 'breaking',
    emoji: '💥',
    zhLabel: '破坏性',
    enLabel: 'Breaking',
    color: '#f5222d',
    bgColor: '#fff1f0',
    borderColor: '#ff4d4f',
    description: 'Breaking changes',
    descriptionZh: '破坏性变更',
    issueLabel: '💥 breaking: 破坏性变更'
  }
];

export const TYPE_ENUM = COMMIT_TYPES.map(t => t.type);

const TYPE_ALIAS_MAP: Record<string, string> = {};
for (const config of COMMIT_TYPES) {
  TYPE_ALIAS_MAP[config.type] = config.type;
  if (config.aliases) {
    for (const alias of config.aliases) {
      TYPE_ALIAS_MAP[alias] = config.type;
    }
  }
}

export const COMMIT_TYPE_MAP = Object.fromEntries(
  COMMIT_TYPES.map(t => [t.type, t])
);

function normalizeType(type: string): string {
  const lowerType = type.toLowerCase();
  return TYPE_ALIAS_MAP[lowerType] || TYPE_ALIAS_MAP[type] || 'chore';
}

export function getCommitTypeConfig(type: string): CommitTypeConfig {
  const normalizedType = normalizeType(type);
  return (
    COMMIT_TYPE_MAP[normalizedType] || {
      type: 'chore',
      emoji: '🔧',
      zhLabel: '杂项',
      enLabel: 'Chore',
      color: '#8c8c8c',
      bgColor: '#fafafa',
      borderColor: '#d9d9d9',
      description: 'Other changes',
      descriptionZh: '其他修改',
      issueLabel: '🔧 chore: 其他修改'
    }
  );
}

export function getEmoji(type: string): string {
  const config = getCommitTypeConfig(type);
  return config.emoji;
}

export function getColor(type: string): string {
  const config = getCommitTypeConfig(type);
  return config.color;
}

export function getBgColor(type: string): string {
  const config = getCommitTypeConfig(type);
  return config.bgColor;
}

export function getBorderColor(type: string): string {
  const config = getCommitTypeConfig(type);
  return config.borderColor;
}

export function getLabel(type: string, lang: 'zh' | 'en' = 'zh'): string {
  const config = getCommitTypeConfig(type);
  return lang === 'zh' ? config.zhLabel : config.enLabel;
}

export function getIssueCategoryOptions(): { label: string; value: string }[] {
  return COMMIT_TYPES.map(config => ({
    label: config.issueLabel,
    value: config.type
  }));
}
