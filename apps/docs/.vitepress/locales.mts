import type { DefaultTheme, LocaleConfig } from 'vitepress';

import {
  GUIDE_SIDEBAR_EN,
  GUIDE_SIDEBAR_ZH,
  getNavConfig,
  getSidebarConfig
} from '../../../configs/index';

const config = {
  root: {
    label: '简体中文',
    lang: 'zh-CN',
    link: '/zh/',
    themeConfig: {
      lastUpdated: {
        text: '最后更新于',
        formatOptions: {
          dateStyle: 'medium',
          timeStyle: 'short'
        }
      },
      editLink: {
        pattern: 'https://github.com/HeJiaYue520/Element-Plus-X/edit/main/apps/docs/:path',
        text: '在 GitHub 上编辑此页面'
      },
      nav: getNavConfig('zh') as DefaultTheme.NavItem[],
      sidebar: {
        '/zh/components/': getSidebarConfig('zh') as DefaultTheme.SidebarItem[],
        '/zh/guide/': GUIDE_SIDEBAR_ZH as DefaultTheme.SidebarItem[]
      },
      search: {
        provider: 'local',
        options: {
          translations: {
            button: {
              buttonText: '搜索文档',
              buttonAriaLabel: '搜索文档'
            },
            modal: {
              noResultsText: '无法找到相关结果',
              resetButtonTitle: '清除查询条件',
              footer: {
                selectText: '选择',
                navigateText: '切换',
                closeText: '关闭'
              }
            }
          }
        }
      },
      docFooter: {
        prev: '上一篇',
        next: '下一篇'
      },
      sidebarMenuLabel: '菜单',
      returnToTopLabel: '返回顶部',
      darkModeSwitchLabel: '深色模式',
      outline: {
        label: '目录',
        level: [2, 6]
      }
    }
  },
  en: {
    label: 'English',
    lang: 'en-US',
    link: '/en/',
    themeConfig: {
      lastUpdated: {
        text: 'Last updated',
        formatOptions: {
          year: 'numeric',
          month: 'numeric',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false
        }
      },
      editLink: {
        pattern: 'https://github.com/HeJiaYue520/Element-Plus-X/edit/main/apps/docs/:path',
        text: 'Edit this page on GitHub'
      },
      nav: getNavConfig('en') as DefaultTheme.NavItem[],
      sidebar: {
        '/en/components/': getSidebarConfig('en') as DefaultTheme.SidebarItem[],
        '/en/guide/': GUIDE_SIDEBAR_EN as DefaultTheme.SidebarItem[]
      },
      search: {
        provider: 'local',
        options: {
          translations: {
            button: {
              buttonText: 'Search',
              buttonAriaLabel: 'Search'
            },
            modal: {
              noResultsText: 'No results found',
              resetButtonTitle: 'Clear query',
              footer: {
                selectText: 'Select',
                navigateText: 'Navigate',
                closeText: 'Close'
              }
            }
          }
        }
      },
      docFooter: {
        prev: 'Previous',
        next: 'Next'
      },
      sidebarMenuLabel: 'Menu',
      returnToTopLabel: 'Back to top',
      darkModeSwitchLabel: 'Dark mode',
      outline: {
        label: '📖 Table of Contents',
        level: [2, 6]
      }
    }
  }
} satisfies LocaleConfig<DefaultTheme.Config>;

export default config;
