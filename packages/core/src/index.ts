import type { App, Plugin } from 'vue';
import { provideGlobalConfig as provideElementPlusGlobalConfig } from 'element-plus';
import Attachments from './components/Attachments/index.vue';
import Bubble from './components/Bubble/index.vue';
import BubbleList from './components/BubbleList/index.vue';
import { provideGlobalConfig } from './components/ConfigProvider/hooks';
import ConfigProvider from './components/ConfigProvider/index.vue';
import Conversations from './components/Conversations/index.vue';
import FilesCard from './components/FilesCard/index.vue';
import MentionSender from './components/MentionSender/index.vue';
import Prompts from './components/Prompts/index.vue';
import Sender from './components/Sender/index.vue';
import Thinking from './components/Thinking/index.vue';
import ThoughtChain from './components/ThoughtChain/index.vue';
import Typewriter from './components/Typewriter/index.vue';
import Welcome from './components/Welcome/index.vue';
import XMarkdown from './components/XMarkdown/index.vue';
import XMarkdownAsync from './components/XMarkdownAsync/index.vue';
import XSender from './components/XSender/index.vue';
import { resolveElementPlusLocale } from './locale/element-plus';

export { Attachments };
export { Bubble };
export { BubbleList };
export { ConfigProvider };
export { Conversations };
export { FilesCard };
export { MentionSender };
export { Prompts };
export { Sender };
export { Thinking };
export { ThoughtChain };
export { Typewriter };
export { Welcome };
export { XMarkdown };
export { XMarkdownAsync };
export { XSender };
export type {
  AttachmentsEmits,
  AttachmentsProps,
  FileListProps
} from './components/Attachments/types.d.ts';
export type { BubbleEmits, BubbleProps } from './components/Bubble/types.d.ts';
export type {
  BubbleListEmits,
  BubbleListInstance,
  BubbleListItemProps,
  BubbleListProps
} from './components/BubbleList/types.d.ts';
export type {
  ConfigProviderProps,
  MarkdownItPlugin
} from './components/ConfigProvider/types.d.ts';
export type {
  Conversation,
  ConversationItem,
  ConversationItemUseOptions,
  ConversationMenu,
  ConversationMenuCommand,
  ConversationsEmits,
  GroupableOptions,
  GroupItem
} from './components/Conversations/types.d.ts';
export type {
  FilesCardEmits,
  FilesCardInstance,
  FilesCardProps,
  FilesType
} from './components/FilesCard/types.d.ts';
export type {
  MentionOption,
  MentionSenderEmits,
  MentionSenderProps
} from './components/MentionSender/types.d.ts';
export type {
  PromptsEmits,
  PromptsItemsProps,
  PromptsProps
} from './components/Prompts/types.d.ts';
export type {
  SenderEmits,
  SenderProps,
  TriggerEvent
} from './components/Sender/types.d.ts';
export type {
  ThinkingEmits,
  ThinkingProps,
  ThinkingStatus
} from './components/Thinking/types.d.ts';
export type {
  DefaultColor,
  DefaultThoughtChainItemProps,
  HexColor,
  ThoughtChainItemProps,
  ThoughtChainProps
} from './components/ThoughtChain/types.d.ts';
export type {
  TypewriterEmits,
  TypewriterInstance,
  TypewriterProps,
  TypingConfig,
  TypingFogfig
} from './components/Typewriter/types.d.ts';
export type {
  SemanticType,
  WelcomeProps
} from './components/Welcome/types.d.ts';
export type {
  CodeXProps,
  XMarkdownProps
} from './components/XMarkdown/types.d.ts';
export type { XMarkdownAsyncProps } from './components/XMarkdownAsync/types.d.ts';
export type {
  ChatNode,
  FocusType,
  ModelValue,
  SenderState,
  Write,
  XSenderEmits,
  XSenderProps
} from './components/XSender/types.d.ts';

export * from './hooks';
export * from './locale';
export interface ElementPlusXInstallOptions {
  locale?: import('./locale/types').Language;
}

const ElementPlusX: Plugin = {
  install(app: App, options: ElementPlusXInstallOptions = {}) {
    provideGlobalConfig(
      {
        locale: options.locale
      },
      app
    );
    provideElementPlusGlobalConfig(
      {
        locale: resolveElementPlusLocale(options.locale)
      },
      app,
      true
    );
    app.component('Attachments', Attachments);
    app.component('Bubble', Bubble);
    app.component('BubbleList', BubbleList);
    app.component('ConfigProvider', ConfigProvider);
    app.component('Conversations', Conversations);
    app.component('FilesCard', FilesCard);
    app.component('MentionSender', MentionSender);
    app.component('Prompts', Prompts);
    app.component('Sender', Sender);
    app.component('Thinking', Thinking);
    app.component('ThoughtChain', ThoughtChain);
    app.component('Typewriter', Typewriter);
    app.component('Welcome', Welcome);
    app.component('XMarkdown', XMarkdown);
    app.component('XMarkdownAsync', XMarkdownAsync);
    app.component('XSender', XSender);
  }
};

export default ElementPlusX;
