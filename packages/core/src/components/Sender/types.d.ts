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
  submitType?: 'enter' | 'shiftEnter';
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

  // 新增 sender 边框的样式渐变色
  senderLineGradientColor?: string;
}

export interface TriggerEvent {
  oldValue: string; // 明确触发的字符
  newValue: string; // 当前输入框的值
  isOpen: boolean; // 弹窗状态
}
