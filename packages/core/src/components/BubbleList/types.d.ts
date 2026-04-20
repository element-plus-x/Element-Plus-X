import type { BubbleProps } from '../Bubble/types';

export type BubbleListScrollState =
  | 'AT_BOTTOM'
  | 'SCROLLED_UP'
  | 'HAS_NEW_MESSAGES';

export type BubbleListFollowReason =
  | 'own-message'
  | 'streaming'
  | 'new-message';

export type BubbleListBoundaryStateType =
  | 'idle'
  | 'loading'
  | 'no-more'
  | 'error';

export interface BubbleListItemProps extends BubbleProps {
  id?: string | number;
  key?: string | number;
  type?: string;
  itemType?: string;
}

export interface BubbleListFollowContext<
  T extends BubbleListItemProps = BubbleListItemProps
> {
  /**
   * 内容变化来源，仅作为信息字段透传给 shouldFollowContent 回调，
   * 组件默认行为不依赖此字段（默认：autoScroll 开启且当前在底部时跟随，上滑后中断）。
   *
   * - own-message：推断为本端发送的消息（通过 item.placement === 'end' 判断，best-effort）
   * - new-message：新追加的非流式消息
   * - streaming：最后一条消息的流式增量内容更新
   *
   * 如需基于消息类型做精细控制，请在 shouldFollowContent 回调中使用此字段自行判断。
   */
  reason: BubbleListFollowReason;
  item: T;
  index: number;
  scrollState: BubbleListScrollState;
  unreadCount: number;
  autoScroll: boolean;
}

export interface BubbleListItemContext<
  T extends BubbleListItemProps = BubbleListItemProps
> {
  item: T;
  index: number;
  itemType?: string;
  scrollState: BubbleListScrollState;
  unreadCount: number;
  autoScroll: boolean;
}

export interface BubbleListBoundaryState {
  type: BubbleListBoundaryStateType;
  text?: string;
}

export interface BubbleListBoundaryContext {
  status: BubbleListBoundaryState;
  position: 'top' | 'bottom';
  scrollState: BubbleListScrollState;
  unreadCount: number;
  autoScroll: boolean;
}

export interface BubbleListBackButtonContext {
  unreadCount: number;
  scrollState: BubbleListScrollState;
  label: string;
  autoScroll: boolean;
  virtualEnabled: boolean;
  scrollToBottom: (smooth?: boolean) => void;
}

interface BackButtonPosition {
  top?: string;
  right?: string;
  bottom?: string;
  left?: string;
  transform?: string;
}

export type BubbleListItemKeyResolver<
  T extends BubbleListItemProps = BubbleListItemProps
> = keyof T | ((item: T, index: number) => string | number);

export type BubbleListItemTypeResolver<
  T extends BubbleListItemProps = BubbleListItemProps
> = keyof T | ((item: T, index: number) => string | undefined);

export interface BubbleListProps<
  T extends BubbleListItemProps = BubbleListItemProps
> {
  list: T[];
  autoScroll?: boolean;
  maxHeight?: string;
  showBackButton?: boolean;
  backButtonThreshold?: number;
  backButtonPosition?: BackButtonPosition;
  backButtonSmoothScroll?: boolean;
  alwaysShowScrollbar?: boolean;
  btnLoading?: boolean;
  btnColor?: string;
  btnIconSize?: number;
  virtual?: boolean;
  smoothScroll?: boolean;
  itemKey?: BubbleListItemKeyResolver<T>;
  itemType?: BubbleListItemTypeResolver<T>;
  loadMoreTopThreshold?: number;
  loadMoreBottomThreshold?: number;
  topStatus?: BubbleListBoundaryState | null;
  bottomStatus?: BubbleListBoundaryState | null;
  /**
   * 自定义内容跟随策略。
   * 传入后将优先生效，可由业务决定“追加后自动触底 / 不自动触底”。
   * 未传入时，组件使用内置默认策略兜底。
   */
  shouldFollowContent?: (context: BubbleListFollowContext<T>) => boolean;
}

export interface BubbleListEmits {
  (event: 'loadMoreTop'): void;
  (event: 'loadMoreBottom'): void;
  (event: 'scrollStateChange', state: BubbleListScrollState): void;
  (event: 'unreadCountChange', count: number): void;
}

export interface BubbleListInstance {
  scrollToTop: (smooth?: boolean) => void;
  scrollToBottom: (smooth?: boolean) => void;
  scrollToBubble: (index: number, smooth?: boolean) => void;
  currentScrollState: BubbleListScrollState;
  currentUnreadCount: number;
  virtualizerRef?: unknown;
  loadMoreTopComplete: () => void;
  loadMoreBottomComplete: () => void;
}
