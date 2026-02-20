import type { BubbleProps } from '../Bubble/types';

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
  maxHeight?: string;
  showBackButton?: boolean;
  backButtonThreshold?: number;
  backButtonPosition?: BackButtonPosition;
  alwaysShowScrollbar?: boolean;
  btnLoading?: boolean;
  btnColor?: string;
  btnIconSize?: number;
}

export interface BubbleListInstance {
  scrollToTop: () => void;
  scrollToBottom: () => void;
  scrollToBubble: (index: number) => void;
}
