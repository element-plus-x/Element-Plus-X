import type { DefaultTheme, LocaleConfig } from 'vitepress';

const config = {
  // root 设置为默认语言（英文）
  root: {
    label: '简体中文',
    lang: 'zh-CN',
    link: '/zh/',
    themeConfig: {
      lastUpdated: {
        text: '最后更新于',
        formatOptions: {
          dateStyle: 'medium',
          timeStyle: 'short',
        },
      },
      editLink: {
        pattern: 'https://github.com/HeJiaYue520/Element-Plus-X/edit/main/apps/docs/:path',
        text: '在 GitHub 上编辑此页面'
      },
      // 中文导航 - 所有链接都加上 /zh/ 前缀
      nav: [
        { text: '生态', items: [
          { text: 'ruoyi-element-ai (模板项目)', link: 'https://chat-docs.element-plus-x.com/' },
          { text: 'element-ui-x (vue2版本)', link: 'https://element-ui-x.com/' },
          { text: 'hook-fetch (优雅请求库)', link: 'https://jsonlee12138.github.io/hook-fetch/' },
          { text: 'ChatArea (轻量级聊天框)', link: 'https://jianfv.top/ChatAreaDoc/home' },
        ] },
        { text: 'v1.x (当前)', items: [
          { text: 'v1.x (当前)', link: 'https://v1.element-plus-x.com/zh/' },
          { text: 'v2.x (Beta)', link: 'https://v2.element-plus-x.com/zh/' },
        ] },
        { text: '指南', link: '/zh/guide/install' },
        { text: '组件', link: '/zh/components/xsender/' },
      ],

      // 中文侧边栏
      sidebar: {
        '/zh/components/': [
          {
            text: '上新',
            items: [
              { text: 'XSender 输入框', link: '/zh/components/xsender/' },
              { text: 'XMarkdown（独立包）', link: '/zh/components/xMarkdown/' },
            ],
          },
          {
            text: '配置',
            items: [
              { text: 'ConfigProvider 全局配置', link: '/zh/components/configProvider/' },
            ],
          },
          {
            text: '通用',
            items: [
              { text: 'Bubble 对话气泡', link: '/zh/components/bubble/' },
              { text: 'BubbleList 气泡列表', link: '/zh/components/bubbleList/' },
              { text: 'Conversations 会话管理', link: '/zh/components/conversations/' },
            ],
          },
          {
            text: '唤醒',
            items: [
              { text: 'Welcome 欢迎', link: '/zh/components/welcome/' },
              { text: 'Prompts 提示集', link: '/zh/components/prompts/' },
            ],
          },
          {
            text: '表达',
            items: [
              { text: 'FilesCard 文件卡片', link: '/zh/components/filesCard/' },
              { text: 'Attachments 输入附件', link: '/zh/components/attachments/' },
            ],
          },
          {
            text: '确认',
            items: [
              { text: 'Thinking 思考中', link: '/zh/components/thinking/' },
              { text: 'ThoughtChain 思维链', link: '/zh/components/thoughtChain/' },
            ],
          },
          {
            text: '工具',
            items: [
              { text: 'useRecord', link: '/zh/components/useRecord/' },
              { text: 'useXStream', link: '/zh/components/useXStream/' },
              { text: 'useSend & XRequest', link: '/zh/components/useSend/' },
            ],
          },
        ],
        '/zh/guide/': [
          {
            text: '基础',
            items: [
              { text: '安装指南', link: '/zh/guide/install' },
              { text: '开发指南', link: '/zh/guide/develop' },
            ],
          },
          {
            text: '社区',
            items: [
              { text: '交流邀请', link: '/zh/introduce' },
            ],
          },
          {
            text: '变更',
            items: [
              { text: '更新日志', link: '/zh/update-log' },
            ],
          },
          {
            text: '反馈',
            items: [
              { text: '问题反馈', link: '/zh/guide/issue/' },
            ],
          },
          {
            text: '贡献',
            items: [
              { text: '贡献指南', link: '/zh/guide/contribution' },
            ],
          },
        ],
      },

      // 中文搜索配置
      search: {
        provider: 'local',
        options: {
          translations: {
            button: {
              buttonText: '搜索文档',
              buttonAriaLabel: '搜索文档',
            },
            modal: {
              noResultsText: '无法找到相关结果',
              resetButtonTitle: '清除查询条件',
              footer: {
                selectText: '选择',
                navigateText: '切换',
                closeText: '关闭',
              },
            },
          },
        },
      },

      // 中文页脚
      docFooter: {
        prev: '上一篇',
        next: '下一篇',
      },
      sidebarMenuLabel: '菜单',
      returnToTopLabel: '返回顶部',
      // lastUpdatedText: '最后更新于',
      darkModeSwitchLabel: '深色模式',
      outline: {
        label: '目录',
        level: [2, 6],
      },
    },
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
        },
      },
      editLink: {
        pattern: 'https://github.com/HeJiaYue520/Element-Plus-X/edit/main/apps/docs/:path',
        text: 'Edit this page on GitHub'
      },

      // 英文导航 - 所有链接都加上 /en/ 前缀
      nav: [
        { text: 'Ecosystem', items: [
          { text: 'ruoyi-element-ai (Template)', link: 'https://chat-docs.element-plus-x.com/' },
          { text: 'element-ui-x (Vue2)', link: 'https://element-ui-x.com/' },
          { text: 'hook-fetch (Request Lib)', link: 'https://jsonlee12138.github.io/hook-fetch/' },
          { text: 'ChatArea (Chat Box)', link: 'https://jianfv.top/ChatAreaDoc/home' },
        ] },
        { text: 'v1.x (Current)', items: [
          { text: 'v1.x (Current)', link: 'https://v1.element-plus-x.com/en/' },
          { text: 'v2.x (Beta)', link: 'https://v2.element-plus-x.com/en/' },
        ] },
        { text: 'Guide', link: '/en/guide/install' },
        { text: 'Components', link: '/en/components/xsender/' },
      ],

      // 英文侧边栏
      sidebar: {
        '/en/components/': [
          {
            text: 'New',
            items: [
              { text: 'XSender Input', link: '/en/components/xsender/' },
              { text: 'XMarkdown (External)', link: '/en/components/xMarkdown/' },
            ],
          },
          {
            text: 'Configuration',
            items: [
              { text: 'ConfigProvider', link: '/en/components/configProvider/' },
            ],
          },
          {
            text: 'General',
            items: [
              { text: 'Bubble', link: '/en/components/bubble/' },
              { text: 'BubbleList', link: '/en/components/bubbleList/' },
              { text: 'Conversations', link: '/en/components/conversations/' },
            ],
          },
          {
            text: 'Awakening',
            items: [
              { text: 'Welcome', link: '/en/components/welcome/' },
              { text: 'Prompts', link: '/en/components/prompts/' },
            ],
          },
          {
            text: 'Expression',
            items: [
              { text: 'FilesCard', link: '/en/components/filesCard/' },
              { text: 'Attachments', link: '/en/components/attachments/' },
              { text: 'XSender Input Box', link: '/en/components/xsender/' },
            ],
          },
          {
            text: 'Confirmation',
            items: [
              { text: 'Thinking', link: '/en/components/thinking/' },
              { text: 'ThoughtChain', link: '/en/components/thoughtChain/' },
            ],
          },
          {
            text: 'Tools',
            items: [
              { text: 'useRecord', link: '/en/components/useRecord/' },
              { text: 'useXStream', link: '/en/components/useXStream/' },
              { text: 'useSend & XRequest', link: '/en/components/useSend/' },
            ],
          },
        ],
        '/en/guide/': [
          {
            text: 'Basic',
            items: [
              { text: 'Installation', link: '/en/guide/install' },
              { text: 'Development', link: '/en/guide/develop' },
            ],
          },
          {
            text: 'Community',
            items: [
              { text: 'Invitation', link: '/en/introduce' },
            ],
          },
          {
            text: 'Changelog',
            items: [
              { text: 'Changelog', link: '/en/update-log' },
            ],
          },
          {
            text: 'Feedback',
            items: [
              { text: 'Issue Feedback', link: '/en/guide/issue/' },
            ],
          },
          {
            text: 'Contribution',
            items: [
              { text: 'Contribution Guide', link: '/en/guide/contribution' },
            ],
          },
        ],
      },

      // 英文搜索配置
      search: {
        provider: 'local',
        options: {
          translations: {
            button: {
              buttonText: 'Search',
              buttonAriaLabel: 'Search',
            },
            modal: {
              noResultsText: 'No results found',
              resetButtonTitle: 'Clear query',
              footer: {
                selectText: 'Select',
                navigateText: 'Navigate',
                closeText: 'Close',
              },
            },
          },
        },
      },

      // 英文页脚
      docFooter: {
        prev: 'Previous',
        next: 'Next',
      },
      sidebarMenuLabel: 'Menu',
      returnToTopLabel: 'Back to top',
      // lastUpdatedText: 'Last updated',
      darkModeSwitchLabel: 'Dark mode',
      outline: {
        label: '📖 Table of Contents',
        level: [2, 6],
      },
    },
  },

} satisfies LocaleConfig<DefaultTheme.Config>;

export default config;
