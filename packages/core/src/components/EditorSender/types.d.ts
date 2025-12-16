import type {
  FocusType as FocusSenderType,
  MentionConfig,
  SelectConfig,
  TagData,
  TipConfig,
  TriggerConfig,
  Write as WriteSender
} from 'x-sender';
import type XSender from 'x-sender';

export type FocusType = FocusSenderType;
export type Write = WriteSender;

export interface EditorProps {
  placeholder?: string;
  device?: 'pc' | 'h5' | 'auto';
  autoFocus?: boolean;
  variant?: 'default' | 'updown';
  maxLength?: number;
  submitType?: 'enter' | 'shiftEnter';
  customStyle?: Partial<CSSStyleDeclaration>;
  loading?: boolean;
  disabled?: boolean;
  clearable?: boolean;
  headerAnimationTimer?: number;
  mentionConfig?: MentionConfig;
  triggerConfig?: TriggerConfig[];
  selectConfig?: SelectConfig[];
  tipConfig?: TipConfig | boolean;
  getPlugin?: () => typeof XSender;
}

export interface SenderState {
  isEmpty: boolean;
  textLength: number;
  tipShow: boolean;
}

export interface ModelValue extends TagData {
  html: string;
  text: string;
}

export interface EditorSenderEmits {
  (e: 'submit'): void;
  (e: 'change'): void;
  (e: 'cancel'): void;
  // 文件粘贴事件
  (event: 'pasteFile', firstFile: File, fileList: FileList): void;
}
