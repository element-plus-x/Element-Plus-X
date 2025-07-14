import type { BubbleProps } from '../Bubble/types'

// 暂时这样包一层，后续看有没有拓展
export interface BubbleListItemProps extends BubbleProps {}

interface BackButtonPosition {
  bottom?: string
  left?: string
}

export interface BubbleListProps<T extends BubbleListItemProps = BubbleListItemProps> {
  list: T[]
  maxHeight?: string
  triggerIndices?: 'only-last' | 'all' | number[]
  alwaysShowScrollbar?: boolean // 是否始终显示滚动条
  backButtonThreshold?: number // 底部按钮出现的 滚动阈值
  showBackButton?: boolean // 是否显示 底部按钮
  backButtonPosition?: BackButtonPosition // 底部按钮位置
  btnLoading?: boolean
  btnColor?: string
  btnIconSize?: number
  autoScroll?: boolean
}

// 定义组件实例类型
// 定义组件实例类型
export interface BubbleListInstance {
  scrollToTop: (behavior?: ScrollBehavior) => void
  scrollToBottom: (behavior?: ScrollBehavior) => void
  scrollToBubble: (index: number) => void
  autoScroll: () => ResizeObserver
}
