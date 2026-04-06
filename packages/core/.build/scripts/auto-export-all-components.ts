import childProcess from 'node:child_process';
import path from 'node:path';
import { cwd, exit } from 'node:process';
import { promisify } from 'node:util';
import fs from 'fs-extra';

interface ComponentInfo {
  name: string;
  path: string;
}

const componentTypeExports: Record<string, string[]> = {
  Attachments: ['FileListProps', 'AttachmentsProps', 'AttachmentsEmits'],
  Bubble: ['BubbleProps', 'BubbleEmits'],
  BubbleList: [
    'BubbleListItemProps',
    'BubbleListProps',
    'BubbleListEmits',
    'BubbleListInstance'
  ],
  ConfigProvider: ['MarkdownItPlugin', 'ConfigProviderProps'],
  Conversations: [
    'ConversationItem',
    'ConversationItemUseOptions',
    'ConversationMenuCommand',
    'ConversationMenu',
    'GroupableOptions',
    'Conversation',
    'GroupItem',
    'ConversationsEmits'
  ],
  FilesCard: [
    'FilesType',
    'FilesCardProps',
    'FilesCardEmits',
    'FilesCardInstance'
  ],
  MentionSender: ['MentionOption', 'MentionSenderProps', 'MentionSenderEmits'],
  Prompts: ['PromptsItemsProps', 'PromptsProps', 'PromptsEmits'],
  Sender: ['SenderProps', 'TriggerEvent', 'SenderEmits'],
  Thinking: ['ThinkingStatus', 'ThinkingProps', 'ThinkingEmits'],
  ThoughtChain: [
    'HexColor',
    'DefaultColor',
    'DefaultThoughtChainItemProps',
    'ThoughtChainItemProps',
    'ThoughtChainProps'
  ],
  Typewriter: [
    'TypingConfig',
    'TypingFogfig',
    'TypewriterProps',
    'TypewriterEmits',
    'TypewriterInstance'
  ],
  Welcome: ['SemanticType', 'WelcomeProps'],
  XMarkdown: ['CodeXProps', 'XMarkdownProps'],
  XMarkdownAsync: ['XMarkdownAsyncProps'],
  XSender: [
    'FocusType',
    'Write',
    'ChatNode',
    'XSenderProps',
    'SenderState',
    'ModelValue',
    'XSenderEmits'
  ]
};

async function generateAutoEntry() {
  const componentsDir = path.resolve(cwd(), 'src/components');
  const components: ComponentInfo[] = [];

  if (await fs.exists(componentsDir)) {
    const dirs = await fs.readdir(componentsDir);

    for (const dir of dirs) {
      const compPath = path.join(componentsDir, dir, 'index.vue');
      if (await fs.exists(compPath)) {
        const compName = dir.replace(/(^\w|-\w)/g, (m: string) =>
          m.replace('-', '').toUpperCase()
        );
        components.push({
          name: compName,
          path: `./components/${dir}/index.vue`
        });
      }
    }
  }

  const installContent = [
    `import type { App, Plugin } from 'vue';`,
    `import { provideGlobalConfig as provideElementPlusGlobalConfig } from 'element-plus';`,
    `import { provideGlobalConfig } from './components/ConfigProvider/hooks';`,
    `import { resolveElementPlusLocale } from './locale/element-plus';`,
    ...components.map(c => `import ${c.name} from '${c.path}';`),
    '',
    ...components.map(c => `export { ${c.name} };`),
    ...components.flatMap(c => {
      const typeNames = componentTypeExports[c.name] ?? [];
      if (!typeNames.length) return [];

      const dirName = c.path.split('/')[2];
      return [
        `export type { ${typeNames.join(', ')} } from './components/${dirName}/types.d.ts';`
      ];
    }),
    '',
    `export { default as en } from './locale/lang/en';`,
    `export { default as zhCn } from './locale/lang/zh-cn';`,
    `export { useLocale, translate, buildTranslator } from './locale/use-locale';`,
    `export type { Language, LanguageConfig, ThinkingLocale, TranslateOption } from './locale/types';`,
    `export interface ElementPlusXInstallOptions {`,
    `  locale?: import('./locale/types').Language;`,
    `}`,
    `export * from './hooks';`,
    '',
    'const ElementPlusX: Plugin = {',
    '  install(app: App, options: ElementPlusXInstallOptions = {}) {',
    '    provideGlobalConfig({',
    '      locale: options.locale',
    '    }, app);',
    '    provideElementPlusGlobalConfig({',
    '      locale: resolveElementPlusLocale(options.locale)',
    '    }, app, true);',
    ...components.map(c => `    app.component('${c.name}', ${c.name});`),
    '  }',
    '};',
    '',
    'export default ElementPlusX;'
  ].join('\n');

  const outputDir = path.resolve(cwd(), 'src');

  try {
    await fs.ensureDir(outputDir);
    const indexFilePath = path.join(outputDir, 'index.ts');
    await fs.writeFile(indexFilePath, installContent);

    console.log('✅ Auto entry file generated successfully!');

    const execAsync = promisify(childProcess.exec);

    try {
      await execAsync(`npx eslint --fix "${indexFilePath}"`);
      console.log('✅ Files formatted with eslint');
    } catch (error) {
      console.warn('⚠️ Eslint formatting failed:', error);
    }
  } catch (error) {
    console.error('❌ Error generating auto-entry files:', error);
    exit(1);
  }
}

void generateAutoEntry();
