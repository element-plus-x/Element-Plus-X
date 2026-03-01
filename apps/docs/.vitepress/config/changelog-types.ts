import {
  COMMIT_TYPES,
  getBgColor,
  getBorderColor,
  getColor,
  getEmoji,
  getLabel,
  TYPE_ENUM
} from '@configs/commit-types';

export interface ChangelogTypeConfig {
  commitTypes: string[];
  emoji: string;
  zhLabel: string;
  enLabel: string;
  color: string;
  bgColor: string;
  borderColor: string;
}

export const CHANGELOG_TYPE_CONFIG: Record<string, ChangelogTypeConfig> =
  Object.fromEntries(
    COMMIT_TYPES.map(config => [
      config.type,
      {
        commitTypes: [config.type],
        emoji: config.emoji,
        zhLabel: config.zhLabel,
        enLabel: config.enLabel,
        color: config.color,
        bgColor: config.bgColor,
        borderColor: config.borderColor
      }
    ])
  );

export const COMMIT_TO_CHANGELOG_MAP: Record<string, string> =
  Object.fromEntries(TYPE_ENUM.map(type => [type.toLowerCase(), type]));

export const VALID_COMMIT_TYPES = TYPE_ENUM;

export const COMPONENT_SCOPES = [
  'Bubble',
  'BubbleList',
  'XSender',
  'Sender',
  'MentionSender',
  'Thinking',
  'ThoughtChain',
  'Welcome',
  'Prompts',
  'Conversations',
  'FilesCard',
  'Attachments',
  'ConfigProvider',
  'Typewriter',
  'XMarkdown',
  'Typography',
  'useRecord',
  'useXStream',
  'useSend',
  'XRequest'
];

export function getTypeConfig(type: string): ChangelogTypeConfig {
  return (
    CHANGELOG_TYPE_CONFIG[type] || {
      commitTypes: ['chore'],
      emoji: '🔧',
      zhLabel: '杂项',
      enLabel: 'Chore',
      color: '#8c8c8c',
      bgColor: '#fafafa',
      borderColor: '#d9d9d9'
    }
  );
}

export {
  getBgColor,
  getBorderColor,
  getColor,
  getEmoji,
  getLabel,
  getLabel as getTagLabel
};
