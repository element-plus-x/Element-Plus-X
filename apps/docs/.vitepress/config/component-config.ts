import {
  getComponentBadges,
  getComponentImports,
  getComponentTitles
} from '../../../../configs/index';

export type {
  BadgeConfig,
  ComponentImportConfig,
  ComponentTitleConfig
} from '../../../../configs/types';

export const componentBadges = getComponentBadges();

export const componentTitles = getComponentTitles();

export const componentImports = getComponentImports();
