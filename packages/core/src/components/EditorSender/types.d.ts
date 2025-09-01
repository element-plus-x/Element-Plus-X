import type {
  CustomTag as CustomTagType,
  SelectTag as SelectTagType,
  TagInfo as TagInfoType,
  UserInfo as UserInfoType
} from 'chatarea';

export type SelectTag = SelectTagType;
export type TagInfo = TagInfoType;
export type UserInfo = UserInfoType;
export type CustomTag = CustomTagType;

export interface EditorProps {
  placeholder?: string;
  device?: 'pc' | 'h5';
  autoFocus?: boolean;
  variant?: 'default' | 'updown';
  userList?: UserInfo[];
  customTrigger?: CustomTag[];
  selectList?: SelectTag[];
  maxLength?: number;
  submitType?: 'enter' | 'shiftEnter';
  customStyle?: Record<string, any>;
  loading?: boolean;
  disabled?: boolean;
  clearable?: boolean;
  headerAnimationTimer?: number;
  asyncMatchFun?: (searchVal: string) => Promise<UserInfo[]>;
  customDialog?: boolean;
}

export interface ChatState {
  isEmpty: boolean;
  textLength: number;
  lastFocusNode: Node | null;
  lastOffset: number;
  wrapCallSelectDialog: boolean;
  beforeText?: string;
  afterText?: string;
}

export interface SubmitResult {
  text: string;
  html: string;
  inputTags: Record<string, (string | null)[]>;
  userTags?: UserInfo[];
  selectTags?: Record<string, SelectTag[]>;
  customTags?: Record<string, TagInfo[]>;
}

export type MixTagType =
  | 'gridInput'
  | 'userTag'
  | 'customTag'
  | 'selectTag'
  | 'inputTag'
  | 'htmlTag';

export interface MixTag {
  type: MixTagType;
  key?: string;
  value?: string;
  placeholder?: string;
}

export interface SelectDialogOption {
  key: string;
  elm: HTMLElement;
  beforeText?: string;
  afterText?: string;
}

export interface EditorSenderEmits {
  (e: 'submit', payload: SubmitResult): void;
  (e: 'change'): void;
  (e: 'cancel'): void;
  (e: 'showAtDialog'): void;
  (e: 'showSelectDialog', key: string, elm: HTMLElement): void;
  (e: 'showTagDialog', prefix: string): void;
  // 文件粘贴事件
  (event: 'pasteFile', firstFile: File, fileList: FileList): void;
}
