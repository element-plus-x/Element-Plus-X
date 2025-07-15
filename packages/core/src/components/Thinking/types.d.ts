// 定义组件状态类型
export type ThinkingStatus = 'start' | 'thinking' | 'end' | 'error';

// 定义组件 ThinkingProps
export interface ThinkingProps {
  /** 初始展开状态 */
  modelValue?: boolean;
  /** 思维链内容（字符串格式） */
  content?: string;
  /** 当前状态 */
  status?: ThinkingStatus;
  /** 是否禁用 */
  disabled?: boolean;
  /** 自动收起 */
  autoCollapse?: boolean;
  /** 动画时长 */
  duration?: string;
  /** 展开收起按钮宽度 */
  buttonWidth?: string;
  /** 展开内容最大宽度 */
  maxWidth?: string;
  /** 展示内容的背景色 */
  backgroundColor?: string;
  /** 展开内容字体颜色 */
  color?: string;
}

export interface ThinkingEmits {
  (event: 'change', value: { value: boolean; status: ThinkingStatus }): void;
  (event: 'update:expanded', value: boolean): void;
}
