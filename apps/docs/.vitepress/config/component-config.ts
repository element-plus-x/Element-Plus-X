export interface BadgeConfig {
  type: 'beta' | 'new' | 'updated' | 'deprecated' | 'experimental';
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

export const componentBadges: Record<string, BadgeConfig> = {
  '/zh/components/xsender/': { type: 'new', text: '2.0.0' },
  '/zh/components/xMarkdown/': { type: 'beta', text: 'Beta' },
  '/zh/components/configProvider/': { type: 'beta', text: 'Beta' },
  '/en/components/xsender/': { type: 'new', text: '2.0.0' },
  '/en/components/xMarkdown/': { type: 'beta', text: 'Beta' },
  '/en/components/configProvider/': { type: 'beta', text: 'Beta' }
};

export const componentTitles: Record<string, ComponentTitleConfig> = {
  Welcome: { zh: 'Welcome 欢迎', en: 'Welcome Component' },
  Attachments: {
    zh: 'Attachments 附件上传组件',
    en: 'Attachments File Upload Component'
  },
  Bubble: { zh: 'Bubble 对话气泡', en: 'Bubble Component' },
  BubbleList: { zh: 'BubbleList 气泡列表', en: 'BubbleList Component' },
  Conversations: {
    zh: 'Conversations 会话管理组件',
    en: 'Conversations Component'
  },
  FilesCard: { zh: 'FilesCard 文件卡片', en: 'FilesCard Component' },
  Prompts: { zh: 'Prompts 提示集组件', en: 'Prompts Component' },
  Thinking: { zh: 'Thinking 思考中', en: 'Thinking Component' },
  ThoughtChain: { zh: 'ThoughtChain 思维链', en: 'ThoughtChain Component' },
  useRecord: { zh: 'useRecord', en: 'useRecord' },
  useSend: { zh: 'useSend & XRequest', en: 'useSend & XRequest' },
  useXStream: { zh: 'useXStream', en: 'useXStream' },
  XMarkdown: { zh: 'XMarkdown 渲染组件', en: 'XMarkdown Rendering Component' },
  XSender: { zh: 'XSender 输入框', en: 'XSender Input Box' },
  ConfigProvider: {
    zh: 'ConfigProvider 全局配置',
    en: 'ConfigProvider Component'
  }
};

export const componentImports: Record<string, ComponentImportConfig> = {
  XMarkdown: {
    importStatement: "import { MarkdownRenderer } from 'x-markdown-vue'",
    styleStatement: "import 'x-markdown-vue/style'",
    externalSourceLink: 'https://github.com/element-plus-x/x-markdown',
    npmLink: 'https://www.npmjs.com/package/x-markdown-vue'
  }
};
