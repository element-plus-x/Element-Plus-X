import type {
  ComponentBadge,
  ComponentCategory,
  ComponentConfig,
  NavItem,
  SidebarItem
} from './types';

declare const __DOCS_LINE__: string;
declare const __DOCS_V1_ORIGIN__: string;
declare const __DOCS_V2_ORIGIN__: string;

const DOCS_LINE = typeof __DOCS_LINE__ !== 'undefined' ? __DOCS_LINE__ : 'v1';
const DOCS_V1_ORIGIN =
  typeof __DOCS_V1_ORIGIN__ !== 'undefined'
    ? __DOCS_V1_ORIGIN__
    : 'https://v1.element-plus-x.com';
const DOCS_V2_ORIGIN =
  typeof __DOCS_V2_ORIGIN__ !== 'undefined'
    ? __DOCS_V2_ORIGIN__
    : 'https://v2.element-plus-x.com';

const V1_LABEL = DOCS_LINE === 'v1' ? 'v1.x (\u5F53\u524D)' : 'v1.x';
const V2_LABEL =
  DOCS_LINE === 'v2' ? 'v2.x (Beta, \u5F53\u524D)' : 'v2.x (Beta)';

function mapNavText(text: string, lang: 'zh' | 'en'): string {
  if (lang === 'zh') return text;
  if (text.startsWith('v1.x')) return text.replace('\u5F53\u524D', 'Current');
  if (text.startsWith('v2.x')) return text.replace('\u5F53\u524D', 'Current');
  return text === '\u751F\u6001' ? 'Ecosystem' : text;
}

export const COMPONENT_CATEGORIES: Record<
  ComponentCategory,
  { zhLabel: string; enLabel: string }
> = {
  new: { zhLabel: '上新', enLabel: 'New' },
  config: { zhLabel: '配置', enLabel: 'Configuration' },
  general: { zhLabel: '通用', enLabel: 'General' },
  awakening: { zhLabel: '唤醒', enLabel: 'Awakening' },
  expression: { zhLabel: '表达', enLabel: 'Expression' },
  confirmation: { zhLabel: '确认', enLabel: 'Confirmation' },
  tools: { zhLabel: '工具', enLabel: 'Tools' }
};

export const COMPONENTS: ComponentConfig[] = [
  {
    name: 'XSender',
    nameLower: 'xsender',
    zhTitle: 'XSender 输入框',
    enTitle: 'XSender Input',
    category: 'new',
    badge: { type: 'new', text: '2.0.0' }
  },
  {
    name: 'XMarkdown',
    nameLower: 'xMarkdown',
    zhTitle: 'XMarkdown（独立包）',
    enTitle: 'XMarkdown (External)',
    category: 'new',
    badge: { type: 'beta', text: 'Beta' },
    external: {
      package: 'x-markdown-vue',
      npmLink: 'https://www.npmjs.com/package/x-markdown-vue',
      sourceLink: 'https://github.com/element-plus-x/x-markdown',
      importStatement: "import { MarkdownRenderer } from 'x-markdown-vue'",
      styleStatement: "import 'x-markdown-vue/style'"
    }
  },
  {
    name: 'ConfigProvider',
    nameLower: 'configProvider',
    zhTitle: 'ConfigProvider 全局配置',
    enTitle: 'ConfigProvider',
    category: 'config',
    badge: { type: 'beta', text: 'Beta' }
  },
  {
    name: 'Bubble',
    nameLower: 'bubble',
    zhTitle: 'Bubble 对话气泡',
    enTitle: 'Bubble',
    category: 'general'
  },
  {
    name: 'BubbleList',
    nameLower: 'bubbleList',
    zhTitle: 'BubbleList 气泡列表',
    enTitle: 'BubbleList',
    category: 'general'
  },
  {
    name: 'Conversations',
    nameLower: 'conversations',
    zhTitle: 'Conversations 会话管理',
    enTitle: 'Conversations',
    category: 'general'
  },
  {
    name: 'Welcome',
    nameLower: 'welcome',
    zhTitle: 'Welcome 欢迎',
    enTitle: 'Welcome',
    category: 'awakening'
  },
  {
    name: 'Prompts',
    nameLower: 'prompts',
    zhTitle: 'Prompts 提示集',
    enTitle: 'Prompts',
    category: 'awakening'
  },
  {
    name: 'FilesCard',
    nameLower: 'filesCard',
    zhTitle: 'FilesCard 文件卡片',
    enTitle: 'FilesCard',
    category: 'expression'
  },
  {
    name: 'Attachments',
    nameLower: 'attachments',
    zhTitle: 'Attachments 输入附件',
    enTitle: 'Attachments',
    category: 'expression'
  },
  {
    name: 'Thinking',
    nameLower: 'thinking',
    zhTitle: 'Thinking 思考中',
    enTitle: 'Thinking',
    category: 'confirmation'
  },
  {
    name: 'ThoughtChain',
    nameLower: 'thoughtChain',
    zhTitle: 'ThoughtChain 思维链',
    enTitle: 'ThoughtChain',
    category: 'confirmation'
  },
  {
    name: 'useRecord',
    nameLower: 'useRecord',
    zhTitle: 'useRecord',
    enTitle: 'useRecord',
    category: 'tools',
    isHook: true
  },
  {
    name: 'useXStream',
    nameLower: 'useXStream',
    zhTitle: 'useXStream',
    enTitle: 'useXStream',
    category: 'tools',
    isHook: true
  },
  {
    name: 'useSend',
    nameLower: 'useSend',
    zhTitle: 'useSend & XRequest',
    enTitle: 'useSend & XRequest',
    category: 'tools',
    isHook: true
  }
];

export const COMPONENT_NAMES = COMPONENTS.map(c => c.name);
export const COMPONENT_NAMES_LOWER = COMPONENTS.map(c => c.nameLower);

export function getComponentByName(name: string): ComponentConfig | undefined {
  const lowerName = name.toLowerCase();
  return COMPONENTS.find(c => c.name === name || c.nameLower === lowerName);
}

export function getComponentsByCategory(
  category: ComponentCategory
): ComponentConfig[] {
  return COMPONENTS.filter(c => c.category === category);
}

export function getComponentBadges(): Record<string, ComponentBadge> {
  const badges: Record<string, ComponentBadge> = {};
  for (const comp of COMPONENTS) {
    if (comp.badge) {
      badges[`/zh/components/${comp.nameLower}/`] = comp.badge;
      badges[`/en/components/${comp.nameLower}/`] = comp.badge;
    }
  }
  return badges;
}

export function getComponentTitles(): Record<
  string,
  { zh: string; en: string }
> {
  const titles: Record<string, { zh: string; en: string }> = {};
  for (const comp of COMPONENTS) {
    titles[comp.name] = { zh: comp.zhTitle, en: comp.enTitle };
  }
  return titles;
}

export function getComponentImports(): Record<
  string,
  {
    importStatement: string;
    styleStatement?: string;
    externalSourceLink?: string;
    npmLink?: string;
  }
> {
  const imports: Record<
    string,
    {
      importStatement: string;
      styleStatement?: string;
      externalSourceLink?: string;
      npmLink?: string;
    }
  > = {};
  for (const comp of COMPONENTS) {
    if (comp.external) {
      imports[comp.name] = {
        importStatement: comp.external.importStatement,
        styleStatement: comp.external.styleStatement,
        externalSourceLink: comp.external.sourceLink,
        npmLink: comp.external.npmLink
      };
    }
  }
  return imports;
}

export function getCommitScopes(): { value: string; name: string }[] {
  const scopes: { value: string; name: string }[] = COMPONENTS.map(comp => ({
    value: comp.name,
    name: `${comp.name}: ${comp.isHook ? '钩子函数' : '组件'}`
  }));
  scopes.push(
    { value: 'docs', name: 'docs: 文档' },
    { value: 'core', name: 'core: 核心包' }
  );
  return scopes;
}

export function getSidebarConfig(lang: 'zh' | 'en'): SidebarItem[] {
  const sidebar: SidebarItem[] = [];
  const categories = [
    'new',
    'config',
    'general',
    'awakening',
    'expression',
    'confirmation',
    'tools'
  ] as ComponentCategory[];

  for (const category of categories) {
    const comps = getComponentsByCategory(category);
    if (comps.length === 0) continue;

    const categoryLabel = COMPONENT_CATEGORIES[category];
    sidebar.push({
      text: lang === 'zh' ? categoryLabel.zhLabel : categoryLabel.enLabel,
      items: comps.map(comp => ({
        text: lang === 'zh' ? comp.zhTitle : comp.enTitle,
        link: `/${lang}/components/${comp.nameLower}/`,
        badge: comp.badge
      }))
    });
  }

  return sidebar;
}

export const NAV_ECOSYSTEM_ITEMS: NavItem[] = [
  {
    text: '生态',
    items: [
      {
        text: 'ruoyi-element-ai (模板项目)',
        link: 'https://chat-docs.element-plus-x.com/'
      },
      { text: 'element-ui-x (vue2版本)', link: 'https://element-ui-x.com/' },
      {
        text: 'hook-fetch (优雅请求库)',
        link: 'https://jsonlee12138.github.io/hook-fetch/'
      },
      {
        text: 'ChatArea (轻量级聊天框)',
        link: 'https://jianfv.top/ChatAreaDoc/home'
      }
    ]
  },
  {
    text: 'v1.x (当前)',
    items: [
      { text: 'v1.x (当前)', link: 'https://v1.element-plus-x.com/zh/' },
      { text: 'v2.x (Beta)', link: 'https://v2.element-plus-x.com/zh/' }
    ]
  }
];

export function getNavConfig(lang: 'zh' | 'en'): NavItem[] {
  const ecosystemItems = NAV_ECOSYSTEM_ITEMS.map(item => {
    const isVersionGroup =
      item.text.startsWith('v1.x') || item.text.startsWith('v2.x');
    const versionLabel = DOCS_LINE === 'v2' ? V2_LABEL : V1_LABEL;

    return {
      ...item,
      text: isVersionGroup
        ? lang === 'zh'
          ? versionLabel
          : mapNavText(versionLabel, lang)
        : mapNavText(item.text, lang),
      items: item.items?.map(sub => {
        const isV1 = sub.text.startsWith('v1.x');
        const isV2 = sub.text.startsWith('v2.x');
        const text =
          lang === 'zh'
            ? isV1
              ? V1_LABEL
              : isV2
                ? V2_LABEL
                : sub.text
            : mapNavText(sub.text, lang)
                .replace('模板项目', 'Template')
                .replace('优雅请求库', 'Request Lib')
                .replace('轻量级聊天框', 'Chat Box');

        return {
          ...sub,
          text,
          link: isV1
            ? `${DOCS_V1_ORIGIN}/${lang}/`
            : isV2
              ? `${DOCS_V2_ORIGIN}/${lang}/`
              : sub.link
        };
      })
    };
  });

  return [
    ecosystemItems[0],
    ecosystemItems[1],
    { text: lang === 'zh' ? '指南' : 'Guide', link: `/${lang}/guide/install` },
    {
      text: lang === 'zh' ? '组件' : 'Components',
      link: `/${lang}/components/xsender/`
    }
  ];
}

export const GUIDE_SIDEBAR_ZH: SidebarItem[] = [
  {
    text: '基础',
    items: [
      { text: '安装指南', link: '/zh/guide/install' },
      { text: '开发指南', link: '/zh/guide/develop' }
    ]
  },
  {
    text: '社区',
    items: [{ text: '交流邀请', link: '/zh/guide/introduce' }]
  },
  {
    text: '变更',
    items: [{ text: '更新日志', link: '/zh/guide/update-log' }]
  },
  {
    text: '反馈',
    items: [{ text: '问题反馈', link: '/zh/guide/issue' }]
  },
  {
    text: '贡献',
    items: [{ text: '贡献指南', link: '/zh/guide/contribution' }]
  }
];

export const GUIDE_SIDEBAR_EN: SidebarItem[] = [
  {
    text: 'Basic',
    items: [
      { text: 'Installation', link: '/en/guide/install' },
      { text: 'Development', link: '/en/guide/develop' }
    ]
  },
  {
    text: 'Community',
    items: [{ text: 'Invitation', link: '/en/guide/introduce' }]
  },
  {
    text: 'Changelog',
    items: [{ text: 'Changelog', link: '/en/guide/update-log' }]
  },
  {
    text: 'Feedback',
    items: [{ text: 'Issue Feedback', link: '/en/guide/issue' }]
  },
  {
    text: 'Contribution',
    items: [{ text: 'Contribution Guide', link: '/en/guide/contribution' }]
  }
];
