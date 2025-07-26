export interface SenderProps {
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

  // 新增 el-popover 样式透传
  triggerStrings?: string[];
  triggerPopoverVisible?: boolean; // 指令提示框是否可见
  triggerPopoverWidth?: string;
  triggerPopoverLeft?: string;
  triggerPopoverOffset?: number;
  triggerPopoverPlacement?:
    | 'top'
    | 'top-start'
    | 'top-end'
    | 'bottom'
    | 'bottom-start'
    | 'bottom-end'
    | 'left'
    | 'left-start'
    | 'left-end'
    | 'right'
    | 'right-start'
    | 'right-end';
}

export interface TriggerEvent {
  oldValue: string; // 明确触发的字符
  newValue: string; // 当前输入框的值
  triggerString?: string; // 触发的字符串
  isOpen: boolean; // 弹窗状态
}

export interface SenderEmits {
  // 双向绑定相关事件
  (event: 'update:modelValue', value: string): void;
  (event: 'update:triggerPopoverVisible', visible: boolean): void;
  // 操作事件
  (event: 'submit', internalValue: string): void;
  (event: 'cancel', internalValue: string): void;
  // 录音状态变更事件
  (event: 'recordingChange', isRecording: boolean): void;
  // 触发器事件
  (event: 'trigger', value: TriggerEvent): void;
  // 文件粘贴事件
  (event: 'pasteFile', firstFile: File, fileList: FileList): void;
}
