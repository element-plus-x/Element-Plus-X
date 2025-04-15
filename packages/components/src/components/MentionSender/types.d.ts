export interface MentionOption {
  value: string
  label?: string
  disabled?: boolean
  [key: string]: any
}

export interface MentionSenderProps {
  modelValue?: string
  placeholder?: string
  autoSize?: {
    minRows: number
    maxRows: number
  }
  readOnly?: boolean
  disabled?: boolean
  loading?: boolean
  clearable?: boolean
  allowSpeech?: boolean
  submitType?: 'enter' | 'shiftEnter'
  headerAnimationTimer?: number
  inputWidth?: string

  // 变体属性
  variant?: 'default' | 'updown'
  showUpdown?: boolean

  // 新增 el-input 样式透传
  inputStyle?: string | CSSProperties | CSSProperties[] | string[]

  // 提及选项列表
  options?: MentionOption[]
  // 定制筛选器选项逻辑
  filterOption?: (pattern: string, option: MentionOption) => boolean
  // 当退格键被按下做删除操作时，是否将提及部分作为整体删除
  whole?: boolean
  // 当退格键被按下做删除操作时，检查是否将提及部分作为整体删除
  checkIsWhole?: (pattern: string, prefix: string) => boolean
  // 提及的下拉面板是否处于加载状态
  triggerLoading?: boolean
  // 触发字段的前缀。 字符串长度必须且只能为 1
  triggerStrings?: string[]
  triggerPopoverPlacement?: 'bottom' | 'top'
  triggerPopoverOffset?: number
  // 自定义浮层类名
  triggerPopoverClass?: string
}
