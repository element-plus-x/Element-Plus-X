export interface MentionOption {
  value: string;
  label?: string;
  disabled?: boolean;
  [key: string]: any;
}

export interface MentionSenderProps {
  modelValue?: string;
  placeholder?: string;
  autoSize?: {
    minRows: number;
    maxRows: number;
  };
  readOnly?: boolean;
  disabled?: boolean;
  loading?: boolean;
  clearable?: boolean;
  allowSpeech?: boolean;
  submitType?: 'enter' | 'shiftEnter' | 'cmdOrCtrlEnter' | 'altEnter';
  headerAnimationTimer?: number;
  inputWidth?: string;

  // 变体属性
  variant?: 'default' | 'updown';
  showUpdown?: boolean;
  submitBtnDisabled?: boolean;

  // 新增 el-input 样式透传
  inputStyle?: string | CSSProperties | CSSProperties[] | string[];

  // 提及选项列表
  options?: MentionOption[];
  // 定制筛选器选项逻辑
  filterOption?: (pattern: string, option: MentionOption) => boolean;
  // 当退格键被按下做删除操作时，是否将提及部分作为整体删除
  whole?: boolean;
  // 当退格键被按下做删除操作时，检查是否将提及部分作为整体删除
  checkIsWhole?: (pattern: string, prefix: string) => boolean;
  // 提及的下拉面板是否处于加载状态
  triggerLoading?: boolean;
  // 触发字段的前缀。 字符串长度必须且只能为 1
  triggerStrings?: string[];
  // 触发字段的分隔符， 默认为空字符串。字符串长度必须且只能为 1
  triggerSplit?: string;
  // 触发字段的下拉面板的弹出位置
  triggerPopoverPlacement?: 'bottom' | 'top';
  // 触发字段的下拉面板的弹出位置偏移量
  triggerPopoverOffset?: number;
}

export interface MentionSenderEmits {
  // 双向绑定相关事件
  (event: 'update:modelValue', value: string): void;
  // 操作事件
  (event: 'submit', internalValue: string): void;
  (event: 'cancel', internalValue: string): void;
  // 录音状态变更事件
  (event: 'recordingChange', isRecording: boolean): void;
  // 触发器事件
  (event: 'search', pattern: string, prefix: string): void;
  (event: 'select', option: MentionOption, prefix: string): void;
  // 文件粘贴事件
  (event: 'pasteFile', firstFile: File, fileList: FileList): void;
}
