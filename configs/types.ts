export type ComponentCategory =
  | 'new'
  | 'config'
  | 'general'
  | 'awakening'
  | 'expression'
  | 'confirmation'
  | 'tools';

export type BadgeType =
  | 'beta'
  | 'new'
  | 'updated'
  | 'deprecated'
  | 'experimental';

export interface ComponentBadge {
  type: BadgeType;
  text?: string;
}

export interface BadgeConfig {
  type: BadgeType;
  text?: string;
}

export interface ComponentTitleConfig {
  zh: string;
  en: string;
}

export interface ComponentImportConfig {
  importStatement: string;
  styleStatement?: string;
  externalSourceLink?: string;
  npmLink?: string;
}

export interface ExternalPackage {
  package: string;
  npmLink: string;
  sourceLink: string;
  styleStatement?: string;
  importStatement: string;
}

export interface ComponentConfig {
  name: string;
  nameLower: string;
  zhTitle: string;
  enTitle: string;
  category: ComponentCategory;
  badge?: ComponentBadge;
  external?: ExternalPackage;
  isHook?: boolean;
}

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
  commitTypes?: string[];
}

export interface ChangelogTypeConfig {
  type: string;
  commitTypes: string[];
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

export interface SidebarItem {
  text: string;
  items: { text: string; link: string; badge?: ComponentBadge }[];
}

export interface NavItem {
  text: string;
  link?: string;
  items?: { text: string; link: string }[];
}
