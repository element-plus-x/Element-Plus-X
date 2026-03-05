import type { ChangelogTypeConfig } from '../../../../configs/types';

import {
  COMMIT_TYPES,
  COMPONENT_NAMES,
  getBgColor,
  getBorderColor,
  getColor,
  getEmoji,
  getLabel,
  TYPE_ENUM
} from '../../../../configs/index';

export type { ChangelogTypeConfig };

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
        borderColor: config.borderColor,
        description: config.description,
        descriptionZh: config.descriptionZh,
        aliases: config.aliases,
        issueLabel: config.issueLabel,
        type: config.type
      }
    ])
  );

export const COMMIT_TO_CHANGELOG_MAP: Record<string, string> =
  Object.fromEntries(TYPE_ENUM.map(type => [type.toLowerCase(), type]));

export const VALID_COMMIT_TYPES = TYPE_ENUM;

export const COMPONENT_SCOPES = COMPONENT_NAMES;

export function getTypeConfig(type: string): ChangelogTypeConfig {
  return (
    CHANGELOG_TYPE_CONFIG[type] || {
      commitTypes: ['chore'],
      emoji: '🔧',
      zhLabel: '杂项',
      enLabel: 'Chore',
      color: '#8c8c8c',
      bgColor: '#fafafa',
      borderColor: '#d9d9d9',
      type: 'chore',
      description: 'Other changes',
      descriptionZh: '其他修改',
      issueLabel: '🔧 chore: 其他修改',
      aliases: []
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
