import type { BubbleProps } from '../Bubble/types';
import type { TypewriterInstance } from '../Typewriter/types.d.ts';

// 暂时这样包一层，后续看有没有拓展
export interface BubbleListItemProps extends BubbleProps {}

interface BackButtonPosition {
  bottom?: string;
  left?: string;
}

export interface BubbleListProps<
  T extends BubbleListItemProps = BubbleListItemProps
> {
  list: T[];
  autoScroll?: boolean;
  maxWidth?: string;
  maxHeight?: string;
  triggerIndices?: 'only-last' | 'all' | number[];
  showBackButton?: boolean; // 是否显示 底部按钮
  backButtonThreshold?: number; // 底部按钮出现的 滚动阈值
  backButtonPosition?: BackButtonPosition; // 底部按钮位置
  alwaysShowScrollbar?: boolean; // 是否始终显示滚动条
  btnLoading?: boolean;
  btnColor?: string;
  btnIconSize?: number;
}

export interface BubbleListEmits {
  (event: 'complete', instance: TypewriterInstance, index: number): void;
}

export interface BubbleListInstance {
  scrollToTop: () => void;
  scrollToBottom: () => void;
  scrollToBubble: (index: number) => void;
}
