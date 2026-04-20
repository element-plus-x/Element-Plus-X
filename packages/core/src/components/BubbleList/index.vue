<script setup lang="ts" generic="T extends BubbleListItemProps">
import type {
  BubbleListBackButtonContext,
  BubbleListBoundaryContext,
  BubbleListBoundaryState,
  BubbleListEmits,
  BubbleListFollowContext,
  BubbleListFollowReason,
  BubbleListItemContext,
  BubbleListItemProps,
  BubbleListProps,
  BubbleListScrollState
} from './types';
import { ArrowDownBold } from '@element-plus/icons-vue';
import { Virtualizer } from 'virtua/vue';
import {
  computed,
  getCurrentInstance,
  nextTick,
  onUnmounted,
  ref,
  watch
} from 'vue';
import { useNamespace } from '../../hooks/useNamespace';
import useScrollDetector from '../../utils/useScrollDetector.ts';
import Bubble from '../Bubble/index.vue';
import loadingBg from './loading.vue';

const props = withDefaults(defineProps<BubbleListProps<T>>(), {
  list: () => [] as T[],
  autoScroll: true,
  maxHeight: '',
  alwaysShowScrollbar: false,
  backButtonThreshold: 80,
  showBackButton: true,
  backButtonPosition: () => {
    return { bottom: '20px', left: '50%', transform: 'translateX(-50%)' };
  },
  backButtonSmoothScroll: false,
  btnLoading: true,
  btnColor: '#409EFF',
  btnIconSize: 24,
  virtual: true,
  smoothScroll: true,
  topStatus: null,
  bottomStatus: null,
  loadMoreTopThreshold: 80,
  loadMoreBottomThreshold: 80
});

const emit = defineEmits<BubbleListEmits>();
const instance = getCurrentInstance();
const ns = useNamespace('bubble-list');
const MESSAGE_ITEM_TYPES = new Set(['bubble', 'message']);
const BOTTOM_TOLERANCE = 4;
const LEGACY_TOLERANCE = 30;
const LOAD_RESET_DELAY = 2000;
const PROGRAMMATIC_SCROLL_MAX_DURATION = 2000;

type ProgrammaticScrollTarget = 'top' | 'bottom' | 'bubble';

const wrapperStyle = computed(() => {
  return {
    ...ns.cssVarBlock({
      'max-height': props.maxHeight || '100%',
      'btn-size': `${props.btnIconSize}px`
    }),
    '--elx-bubble-list-btn-color': props.btnColor
  };
});

const scrollContainerRef = ref<HTMLElement | null>(null);
const scrollElement = computed(() => scrollContainerRef.value ?? undefined);
const virtualizerRef = ref<any>(null);
const { hasVertical } = useScrollDetector(scrollContainerRef);
const hasWarnedMissingKey = ref(false);

const showBackToBottom = ref(false);
const stopAutoScrollToBottom = ref(false);
const scrollState = ref<BubbleListScrollState>('AT_BOTTOM');
const unreadCount = ref(0);
const isProgrammaticScrolling = ref(false);
const isPrepending = ref(false);
const pendingTopLoad = ref(false);
const pendingBottomLoad = ref(false);
const lastScrollTop = ref(0);
const legacyResizeObserver = ref<ResizeObserver | null>(null);
let programmaticScrollTimer: number | null = null;
let programmaticScrollFrame: number | null = null;
let programmaticScrollTarget: ProgrammaticScrollTarget | null = null;
let loadTopResetTimer: number | null = null;
let loadBottomResetTimer: number | null = null;

const listItemClassName = `${ns.namespace.value}-bubble-list__item`;
const bottomBoundaryClassName = ns.em('boundary', 'bottom');

const hasLoadMoreTopListener = computed(
  () => !!instance?.vnode.props?.onLoadMoreTop
);
const hasLoadMoreBottomListener = computed(
  () => !!instance?.vnode.props?.onLoadMoreBottom
);
const lastIndex = computed(() => props.list.length - 1);
const topBoundaryVisible = computed(() =>
  shouldRenderBoundary(props.topStatus)
);
const bottomBoundaryVisible = computed(() =>
  shouldRenderBoundary(props.bottomStatus)
);

const hasStableVirtualKeys = computed(() => {
  return props.list.every((item, index) => {
    return resolveStableItemKey(item, index) !== undefined;
  });
});

const virtualEnabled = computed(() => {
  return props.virtual && hasStableVirtualKeys.value;
});

const defaultBackButtonLabel = computed(() => {
  if (virtualEnabled.value && unreadCount.value > 0) {
    return `(${unreadCount.value > 99 ? '99+' : unreadCount.value}) 新消息`;
  }

  return '回到底部';
});

const latestItemSignal = computed(() => {
  const index = props.list.length - 1;
  const item = index >= 0 ? props.list[index] : undefined;

  return {
    length: props.list.length,
    firstKey:
      props.list.length > 0
        ? resolveItemKey(props.list[0], 0, false)
        : undefined,
    lastKey: index >= 0 ? resolveItemKey(item, index, false) : undefined,
    itemType: index >= 0 ? resolveItemType(item, index) : undefined,
    content: item?.content ?? '',
    loading: !!item?.loading,
    placement: item?.placement ?? 'start'
  };
});

const boundarySignal = computed(() => {
  return {
    topType: props.topStatus?.type ?? 'idle',
    topText: props.topStatus?.text ?? '',
    bottomType: props.bottomStatus?.type ?? 'idle',
    bottomText: props.bottomStatus?.text ?? ''
  };
});

watch(scrollState, state => {
  emit('scrollStateChange', state);
});

watch(unreadCount, count => {
  emit('unreadCountChange', count);
});

watch(boundarySignal, (current, previous) => {
  if (!previous || !props.autoScroll || scrollState.value !== 'AT_BOTTOM') {
    return;
  }

  const bottomChanged =
    current.bottomType !== previous.bottomType ||
    current.bottomText !== previous.bottomText;

  if (bottomChanged) {
    nextTick(() => {
      scrollToBottom(false);
    });
  }
});

watch(virtualEnabled, enabled => {
  cleanupLegacyResizeObserver();
  if (enabled) {
    nextTick(() => {
      scrollToBottom(false);
      // Double rAF: wait for virtua to complete first-frame measurement then correct
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          scrollToBottom(false);
        });
      });
    });
    return;
  }

  nextTick(() => {
    if (props.autoScroll) {
      legacyAutoScroll();
    }
  });
});

watch(
  () => [props.virtual, hasStableVirtualKeys.value] as const,
  ([requestedVirtual, stableKeys]) => {
    if (
      requestedVirtual &&
      !stableKeys &&
      !hasWarnedMissingKey.value &&
      import.meta.env.DEV
    ) {
      console.warn(
        '[BubbleList]: virtual mode requires stable keys. Provide item.id, item.key, or itemKey. Falling back to legacy mode.'
      );
      hasWarnedMissingKey.value = true;
    }

    if (!requestedVirtual || stableKeys) {
      hasWarnedMissingKey.value = false;
    }
  },
  { immediate: true }
);

watch(
  () => props.list.length,
  () => {
    if (virtualEnabled.value) return;

    if (props.list.length > 0) {
      nextTick(() => {
        if (props.autoScroll) {
          legacyAutoScroll();
        }
      });
    }
  },
  { immediate: true }
);

watch(latestItemSignal, (current, previous) => {
  if (!previous) {
    if (virtualEnabled.value && current.length > 0) {
      nextTick(() => scrollToBottom(false));
    }
    return;
  }

  if (pendingTopLoad.value) {
    const topChanged =
      current.length !== previous.length ||
      current.firstKey !== previous.firstKey;
    if (topChanged) {
      nextTick(() => {
        loadMoreTopComplete();
      });
      return;
    }
  }

  if (pendingBottomLoad.value) {
    const bottomChanged =
      current.length !== previous.length ||
      current.lastKey !== previous.lastKey;
    if (bottomChanged) {
      nextTick(() => {
        loadMoreBottomComplete();
      });
      return;
    }
  }

  if (!virtualEnabled.value || current.length === 0) return;

  if (current.length > previous.length) {
    // Initialization: empty → filled, force instant scroll to avoid smooth overwrites
    if (previous.length === 0) {
      nextTick(() => scrollToBottom(false));
      return;
    }

    const index = current.length - 1;
    const item = props.list[index];
    if (!item) return;

    const addedCount = current.length - previous.length;
    const isMessageItem = isDefaultBubbleItem(item, index);
    const reason: BubbleListFollowReason = item.loading
      ? 'streaming'
      : item.placement === 'end'
        ? 'own-message'
        : 'new-message';

    const shouldFollow = shouldFollowNewContent(reason, item, index);

    if (shouldFollow) {
      scheduleFollowToBottom(reason, item, index, props.smoothScroll);
      return;
    }

    if (!shouldFollow && isMessageItem && reason !== 'streaming') {
      unreadCount.value += addedCount;
      setScrollState('HAS_NEW_MESSAGES');
      showBackToBottom.value = props.showBackButton;
    }
    return;
  }

  const lastItemChanged =
    current.length === previous.length &&
    (current.content !== previous.content ||
      current.loading !== previous.loading);

  if (!lastItemChanged) return;

  const index = current.length - 1;
  const item = props.list[index];
  if (!item) return;

  const shouldFollow = shouldFollowNewContent('streaming', item, index);

  if (shouldFollow) {
    scheduleFollowToBottom('streaming', item, index, false);
  }
});

function normalizeItemType(itemType: string | undefined) {
  return itemType?.trim().toLowerCase();
}

function resolveItemType(item: T | undefined, index: number) {
  if (!item) return undefined;

  const resolver = props.itemType;
  let resolved: unknown;

  if (typeof resolver === 'function') {
    resolved = resolver(item, index);
  } else if (typeof resolver === 'string') {
    resolved = item[resolver];
  }

  if (typeof resolved !== 'string' || resolved.trim() === '') {
    resolved = item.itemType ?? item.type;
  }

  return typeof resolved === 'string' && resolved.trim() !== ''
    ? resolved.trim()
    : undefined;
}

function isDefaultBubbleItem(item: T | undefined, index: number) {
  const itemType = normalizeItemType(resolveItemType(item, index));
  return !itemType || MESSAGE_ITEM_TYPES.has(itemType);
}

function resolveStableItemKey(item: T | undefined, index: number) {
  if (!item) return index;

  const resolver = props.itemKey;
  let resolved: string | number | undefined;

  if (typeof resolver === 'function') {
    resolved = resolver(item, index);
  } else if (typeof resolver === 'string') {
    const candidate = item[resolver];
    if (typeof candidate === 'string' || typeof candidate === 'number') {
      resolved = candidate;
    }
  }

  if (resolved === undefined) {
    resolved = item.id ?? item.key;
  }

  return resolved;
}

function resolveItemKey(
  item: T | undefined,
  index: number,
  warn = true
): string | number {
  let resolved = resolveStableItemKey(item, index);

  if (resolved === undefined) {
    resolved = index;
    if (warn && virtualEnabled.value && import.meta.env.DEV) {
      console.warn(
        '[BubbleList]: stable item key is missing. Provide item.id, item.key, or itemKey when virtual mode is enabled.'
      );
    }
  }

  return resolved;
}

function bubbleItemSpacing(index: number) {
  return index === 0 ? '0px' : '16px';
}

function buildItemContext(item: T, index: number): BubbleListItemContext<T> {
  return {
    item,
    index,
    itemType: resolveItemType(item, index),
    scrollState: scrollState.value,
    unreadCount: unreadCount.value,
    autoScroll: props.autoScroll
  };
}

function buildBoundaryContext(
  position: 'top' | 'bottom',
  status: BubbleListBoundaryState
): BubbleListBoundaryContext {
  return {
    status,
    position,
    scrollState: scrollState.value,
    unreadCount: unreadCount.value,
    autoScroll: props.autoScroll
  };
}

function buildBackButtonContext(): BubbleListBackButtonContext {
  return {
    unreadCount: unreadCount.value,
    scrollState: scrollState.value,
    label: defaultBackButtonLabel.value,
    autoScroll: props.autoScroll,
    virtualEnabled: virtualEnabled.value,
    scrollToBottom
  };
}

function shouldRenderBoundary(status?: BubbleListBoundaryState | null) {
  return !!status && status.type !== 'idle';
}

function resolveBoundaryText(
  status: BubbleListBoundaryState,
  position: 'top' | 'bottom'
) {
  if (status.text) {
    return status.text;
  }

  if (status.type === 'loading') {
    return position === 'top' ? '正在加载历史消息...' : '正在加载更多消息...';
  }

  if (status.type === 'no-more') {
    return position === 'top' ? '没有更多历史消息了' : '已经到底了';
  }

  if (status.type === 'error') {
    return '加载失败，请稍后重试';
  }

  return '';
}

function resolveFallbackItemText(item: T, index: number) {
  const text = typeof item.content === 'string' ? item.content.trim() : '';
  if (text) {
    return text;
  }

  const itemType = resolveItemType(item, index);
  return itemType ? `自定义节点 · ${itemType}` : '自定义节点';
}

function resolveLiveScrollState(): BubbleListScrollState {
  const container = scrollContainerRef.value;
  if (!container) {
    return scrollState.value;
  }

  const { effectiveDistanceToBottom } = resolveDistanceMetrics(container);
  if (effectiveDistanceToBottom <= BOTTOM_TOLERANCE) {
    return 'AT_BOTTOM';
  }

  return unreadCount.value > 0 ? 'HAS_NEW_MESSAGES' : 'SCROLLED_UP';
}

function syncScrollStateFromContainer(): BubbleListScrollState {
  const liveState = resolveLiveScrollState();
  if (liveState !== scrollState.value) {
    setScrollState(liveState);
  }
  return liveState;
}

function buildFollowContext(
  reason: BubbleListFollowReason,
  item: T,
  index: number
): BubbleListFollowContext<T> {
  const liveScrollState = syncScrollStateFromContainer();

  return {
    reason,
    item,
    index,
    scrollState: liveScrollState,
    unreadCount: unreadCount.value,
    autoScroll: props.autoScroll
  };
}

function shouldFollowNewContent(
  reason: BubbleListFollowReason,
  item: T,
  index: number
) {
  const context = buildFollowContext(reason, item, index);

  if (props.shouldFollowContent) {
    return props.shouldFollowContent(context);
  }

  // 默认策略：
  // - own-message / new-message（任何新消息）：始终追底，autoScroll 开启即生效
  //   用户发消息或收到 AI 回复都期望看到新内容出现在可视区
  // - streaming（流式增量）：仅在底部时跟随，上滑后中断（避免打断阅读）
  // 如需完全自定义策略，请使用 shouldFollowContent 回调
  if (reason === 'streaming') {
    return context.autoScroll && context.scrollState === 'AT_BOTTOM';
  }

  return context.autoScroll;
}

function scheduleFollowToBottom(
  reason: BubbleListFollowReason,
  item: T,
  index: number,
  smooth = props.smoothScroll
) {
  nextTick(() => {
    if (!shouldFollowNewContent(reason, item, index)) {
      return;
    }

    scrollToBottom(reason === 'streaming' ? false : smooth);
  });
}

function scrollBoundaryIntoView(
  position: 'top' | 'bottom',
  smooth = props.smoothScroll
) {
  const container = scrollContainerRef.value;
  if (!container) return;

  container.scrollTo({
    top: position === 'top' ? 0 : container.scrollHeight,
    behavior: smooth ? 'smooth' : 'auto'
  });
}

function cleanupProgrammaticScrollTracking() {
  if (programmaticScrollTimer !== null) {
    window.clearTimeout(programmaticScrollTimer);
    programmaticScrollTimer = null;
  }

  if (programmaticScrollFrame !== null) {
    window.cancelAnimationFrame(programmaticScrollFrame);
    programmaticScrollFrame = null;
  }
}

function finishProgrammaticScroll() {
  cleanupProgrammaticScrollTracking();
  isProgrammaticScrolling.value = false;
  programmaticScrollTarget = null;
  updateScrollStateFromContainer();
}

function beginProgrammaticScroll(
  target: ProgrammaticScrollTarget,
  duration = props.smoothScroll ? 320 : 80
) {
  isProgrammaticScrolling.value = true;
  programmaticScrollTarget = target;
  cleanupProgrammaticScrollTracking();

  const startedAt = window.performance.now();
  const timeout = Math.max(duration + 120, PROGRAMMATIC_SCROLL_MAX_DURATION);

  let trackFrameCount = 0;

  const track = () => {
    const container = scrollContainerRef.value;
    if (!container) {
      finishProgrammaticScroll();
      return;
    }

    const { effectiveDistanceToBottom } = resolveDistanceMetrics(container);
    const reachedTarget =
      (target === 'bottom' && effectiveDistanceToBottom <= BOTTOM_TOLERANCE) ||
      (target === 'top' && container.scrollTop <= BOTTOM_TOLERANCE);

    if (reachedTarget || window.performance.now() - startedAt >= timeout) {
      finishProgrammaticScroll();
      return;
    }

    // Actively correct scroll position for bottom target (throttled: every 3 frames)
    if (target === 'bottom' && ++trackFrameCount % 3 === 0) {
      container.scrollTo({ top: container.scrollHeight, behavior: 'auto' });
    }

    programmaticScrollFrame = window.requestAnimationFrame(track);
  };

  programmaticScrollTimer = window.setTimeout(() => {
    finishProgrammaticScroll();
  }, timeout);

  programmaticScrollFrame = window.requestAnimationFrame(track);
}

function scheduleLoadReset(kind: 'top' | 'bottom') {
  const clearTimer = kind === 'top' ? loadTopResetTimer : loadBottomResetTimer;
  if (clearTimer !== null) {
    window.clearTimeout(clearTimer);
  }

  const nextTimer = window.setTimeout(() => {
    if (kind === 'top') {
      pendingTopLoad.value = false;
      isPrepending.value = false;
      loadTopResetTimer = null;
      return;
    }

    pendingBottomLoad.value = false;
    loadBottomResetTimer = null;
  }, LOAD_RESET_DELAY);

  if (kind === 'top') {
    loadTopResetTimer = nextTimer;
    return;
  }

  loadBottomResetTimer = nextTimer;
}

function cleanupLegacyResizeObserver() {
  legacyResizeObserver.value?.disconnect();
  legacyResizeObserver.value = null;
}

function setScrollState(state: BubbleListScrollState) {
  if (scrollState.value !== state) {
    scrollState.value = state;
  }
}

function resolveDistanceMetrics(container: HTMLElement) {
  const rawDistanceToBottom = Math.max(
    container.scrollHeight - (container.scrollTop + container.clientHeight),
    0
  );

  // Keep "at bottom" behavior stable when bottom status area appears/disappears.
  const bottomBoundaryHeight =
    container.querySelector<HTMLElement>(`.${bottomBoundaryClassName}`)
      ?.offsetHeight ?? 0;

  return {
    rawDistanceToBottom,
    effectiveDistanceToBottom: Math.max(
      rawDistanceToBottom - bottomBoundaryHeight,
      0
    )
  };
}

function updateScrollStateFromContainer() {
  const container = scrollContainerRef.value;
  if (!container) return;

  const { effectiveDistanceToBottom } = resolveDistanceMetrics(container);

  showBackToBottom.value =
    props.showBackButton &&
    effectiveDistanceToBottom > props.backButtonThreshold;

  if (
    virtualEnabled.value &&
    isProgrammaticScrolling.value &&
    programmaticScrollTarget === 'bottom'
  ) {
    setScrollState('AT_BOTTOM');
    showBackToBottom.value = false;
    if (unreadCount.value !== 0) {
      unreadCount.value = 0;
    }
    return;
  }

  if (virtualEnabled.value) {
    if (effectiveDistanceToBottom <= BOTTOM_TOLERANCE) {
      setScrollState('AT_BOTTOM');
      if (unreadCount.value !== 0) {
        unreadCount.value = 0;
      }
    } else {
      setScrollState(
        unreadCount.value > 0 ? 'HAS_NEW_MESSAGES' : 'SCROLLED_UP'
      );
    }
  } else if (effectiveDistanceToBottom <= BOTTOM_TOLERANCE) {
    setScrollState('AT_BOTTOM');
  } else {
    setScrollState('SCROLLED_UP');
  }
}

function requestLoadMoreTop() {
  if (
    !virtualEnabled.value ||
    !hasLoadMoreTopListener.value ||
    pendingTopLoad.value
  ) {
    return;
  }

  pendingTopLoad.value = true;
  isPrepending.value = true;
  emit('loadMoreTop');
  scheduleLoadReset('top');
}

function requestLoadMoreBottom() {
  if (
    !virtualEnabled.value ||
    !hasLoadMoreBottomListener.value ||
    pendingBottomLoad.value
  ) {
    return;
  }

  pendingBottomLoad.value = true;
  emit('loadMoreBottom');
  scheduleLoadReset('bottom');
}

function handleLegacyScroll() {
  const container = scrollContainerRef.value;
  if (!container) return;

  const { effectiveDistanceToBottom } = resolveDistanceMetrics(container);

  showBackToBottom.value =
    props.showBackButton &&
    effectiveDistanceToBottom > props.backButtonThreshold;
  stopAutoScrollToBottom.value = effectiveDistanceToBottom > LEGACY_TOLERANCE;
  updateScrollStateFromContainer();
}

function handleVirtualScroll() {
  const container = scrollContainerRef.value;
  if (!container) return;

  const { scrollTop } = container;
  const { effectiveDistanceToBottom } = resolveDistanceMetrics(container);
  const scrollingUp = scrollTop < lastScrollTop.value;
  const scrollingDown = scrollTop > lastScrollTop.value;

  updateScrollStateFromContainer();

  if (!isProgrammaticScrolling.value) {
    if (scrollingUp && scrollTop <= props.loadMoreTopThreshold) {
      requestLoadMoreTop();
    }

    if (
      scrollingDown &&
      effectiveDistanceToBottom <= props.loadMoreBottomThreshold
    ) {
      requestLoadMoreBottom();
    }
  }

  lastScrollTop.value = scrollTop;
}

function handleScroll() {
  if (virtualEnabled.value) {
    handleVirtualScroll();
    return;
  }

  handleLegacyScroll();
}

function legacyScrollToTop(smooth = props.smoothScroll) {
  const container = scrollContainerRef.value;
  if (!container) return;

  stopAutoScrollToBottom.value = true;
  container.scrollTo({
    top: 0,
    behavior: smooth ? 'smooth' : 'auto'
  });
}

function legacyScrollToBottom(smooth = props.smoothScroll) {
  const container = scrollContainerRef.value;
  if (!container) return;

  container.scrollTo({
    top: container.scrollHeight,
    behavior: smooth ? 'smooth' : 'auto'
  });
  stopAutoScrollToBottom.value = false;
}

function legacyScrollToBubble(index: number, smooth = props.smoothScroll) {
  const container = scrollContainerRef.value;
  if (!container) return;

  const items = container.querySelectorAll(`.${listItemClassName}`);
  if (index >= items.length) return;

  stopAutoScrollToBottom.value = true;
  const targetBubble = items[index] as HTMLElement;
  const containerRect = container.getBoundingClientRect();
  const bubbleRect = targetBubble.getBoundingClientRect();
  const scrollPosition =
    bubbleRect.top - containerRect.top + container.scrollTop;

  container.scrollTo({
    top: scrollPosition,
    behavior: smooth ? 'smooth' : 'auto'
  });
}

function legacyAutoScroll() {
  const container = scrollContainerRef.value;
  if (!container) return;

  const listBubbles = container.querySelectorAll(`.${listItemClassName}`);
  const lastItem = listBubbles[listBubbles.length - 1] as
    | HTMLElement
    | undefined;
  if (!lastItem) return;

  let shouldScroll = true;
  if (listBubbles.length > 1) {
    const secondLastItem = listBubbles[listBubbles.length - 2] as HTMLElement;
    const { top, bottom } = secondLastItem.getBoundingClientRect();
    const { top: containerTop, bottom: containerBottom } =
      container.getBoundingClientRect();
    shouldScroll = top < containerBottom && bottom > containerTop;
  }

  if (shouldScroll) {
    legacyScrollToBottom(false);
    stopAutoScrollToBottom.value = false;
  }

  cleanupLegacyResizeObserver();
  legacyResizeObserver.value = new ResizeObserver(() => {
    if (!stopAutoScrollToBottom.value) {
      legacyScrollToBottom(false);
    }
  });
  legacyResizeObserver.value.observe(lastItem);
}

function handleBackButtonClick() {
  scrollToBottom(props.backButtonSmoothScroll);
}

function scrollToTop(smooth = props.smoothScroll) {
  if (!virtualEnabled.value) {
    legacyScrollToTop(smooth);
    return;
  }

  beginProgrammaticScroll('top', smooth ? 320 : 80);
  virtualizerRef.value?.scrollToIndex?.(0, {
    align: 'start',
    smooth
  });

  nextTick(() => {
    scrollBoundaryIntoView('top', smooth);
  });
}

function scrollToBottom(smooth = props.smoothScroll) {
  if (!virtualEnabled.value) {
    legacyScrollToBottom(smooth);
    setScrollState('AT_BOTTOM');
    unreadCount.value = 0;
    showBackToBottom.value = false;
    return;
  }

  beginProgrammaticScroll('bottom', smooth ? 320 : 80);
  if (lastIndex.value >= 0) {
    virtualizerRef.value?.scrollToIndex?.(lastIndex.value, {
      align: 'end',
      smooth
    });
  } else {
    virtualizerRef.value?.scrollTo?.(0);
  }

  nextTick(() => {
    scrollBoundaryIntoView('bottom', smooth);
  });

  setScrollState('AT_BOTTOM');
  unreadCount.value = 0;
  showBackToBottom.value = false;
}

function scrollToBubble(index: number, smooth = props.smoothScroll) {
  if (!virtualEnabled.value) {
    legacyScrollToBubble(index, smooth);
    return;
  }

  beginProgrammaticScroll('bubble', smooth ? 320 : 80);
  virtualizerRef.value?.scrollToIndex?.(index, {
    align: 'start', // 滚动到顶部第一条展示
    smooth
  });
}

function loadMoreTopComplete() {
  if (loadTopResetTimer !== null) {
    window.clearTimeout(loadTopResetTimer);
    loadTopResetTimer = null;
  }

  nextTick(() => {
    pendingTopLoad.value = false;
    isPrepending.value = false;
  });
}

function loadMoreBottomComplete() {
  if (loadBottomResetTimer !== null) {
    window.clearTimeout(loadBottomResetTimer);
    loadBottomResetTimer = null;
  }

  nextTick(() => {
    pendingBottomLoad.value = false;
    if (scrollState.value === 'AT_BOTTOM') {
      scrollToBottom(false);
    }
  });
}

onUnmounted(() => {
  cleanupLegacyResizeObserver();
  cleanupProgrammaticScrollTracking();
  if (loadTopResetTimer !== null) {
    window.clearTimeout(loadTopResetTimer);
  }
  if (loadBottomResetTimer !== null) {
    window.clearTimeout(loadBottomResetTimer);
  }
});

defineExpose({
  scrollToTop,
  scrollToBottom,
  scrollToBubble,
  get currentScrollState() {
    return scrollState.value;
  },
  get currentUnreadCount() {
    return unreadCount.value;
  },
  get virtualizerRef() {
    return virtualizerRef.value;
  },
  loadMoreTopComplete,
  loadMoreBottomComplete
});
</script>

<template>
  <div :class="ns.b()" :style="wrapperStyle">
    <div
      ref="scrollContainerRef"
      :class="[
        ns.e('list'),
        props.alwaysShowScrollbar ? ns.em('list', 'always-scrollbar') : '',
        virtualEnabled ? ns.em('list', 'virtual') : ''
      ]"
      @scroll="handleScroll"
    >
      <div
        v-if="topBoundaryVisible"
        :class="[ns.e('boundary'), ns.em('boundary', 'top')]"
        :data-state="props.topStatus?.type"
      >
        <slot
          name="topStatus"
          v-bind="buildBoundaryContext('top', props.topStatus!)"
        >
          <div :class="ns.e('boundary-content')">
            <loadingBg
              v-if="props.topStatus?.type === 'loading'"
              :class="ns.e('boundary-loading')"
            />
            <span>{{ resolveBoundaryText(props.topStatus!, 'top') }}</span>
          </div>
        </slot>
      </div>

      <template v-if="!virtualEnabled">
        <div
          v-for="(item, index) in list"
          :key="resolveItemKey(item, index)"
          :class="[
            ns.e('item'),
            !isDefaultBubbleItem(item, index) ? ns.em('item', 'custom') : ''
          ]"
        >
          <template v-if="isDefaultBubbleItem(item, index)">
            <Bubble
              :content="item.content"
              :placement="item.placement"
              :loading="item.loading"
              :shape="item.shape"
              :variant="item.variant"
              :max-width="item.maxWidth"
              :avatar="item.avatar"
              :avatar-size="item.avatarSize"
              :avatar-gap="item.avatarGap"
              :avatar-shape="item.avatarShape"
              :avatar-src-set="item.avatarSrcSet"
              :avatar-alt="item.avatarAlt"
              :avatar-fit="item.avatarFit"
              :no-style="item.noStyle"
            >
              <template v-if="$slots.avatar" #avatar>
                <slot name="avatar" :item="item" />
              </template>
              <template v-if="$slots.header" #header>
                <slot name="header" :item="item" />
              </template>
              <template v-if="$slots.content" #content>
                <slot name="content" :item="item" />
              </template>
              <template v-if="$slots.footer" #footer>
                <slot name="footer" :item="item" />
              </template>
              <template v-if="$slots.loading" #loading>
                <slot name="loading" :item="item" />
              </template>
            </Bubble>
          </template>

          <template v-else>
            <slot name="item" v-bind="buildItemContext(item, index)">
              <div
                :class="ns.e('embedded-item')"
                :data-item-type="resolveItemType(item, index)"
              >
                {{ resolveFallbackItemText(item, index) }}
              </div>
            </slot>
          </template>
        </div>
      </template>

      <template v-else>
        <div :class="ns.e('spacer')" />

        <Virtualizer
          ref="virtualizerRef"
          :data="list"
          :scroll-ref="scrollElement"
          :shift="isPrepending"
        >
          <template #default="{ item, index }">
            <div
              :key="resolveItemKey(item, index)"
              :class="[
                ns.e('virtual-item'),
                ns.e('item'),
                !isDefaultBubbleItem(item, index) ? ns.em('item', 'custom') : ''
              ]"
              :style="{ paddingTop: bubbleItemSpacing(index) }"
            >
              <template v-if="isDefaultBubbleItem(item, index)">
                <Bubble
                  :content="item.content"
                  :placement="item.placement"
                  :loading="item.loading"
                  :shape="item.shape"
                  :variant="item.variant"
                  :max-width="item.maxWidth"
                  :avatar="item.avatar"
                  :avatar-size="item.avatarSize"
                  :avatar-gap="item.avatarGap"
                  :avatar-shape="item.avatarShape"
                  :avatar-src-set="item.avatarSrcSet"
                  :avatar-alt="item.avatarAlt"
                  :avatar-fit="item.avatarFit"
                  :no-style="item.noStyle"
                >
                  <template v-if="$slots.avatar" #avatar>
                    <slot name="avatar" :item="item" />
                  </template>
                  <template v-if="$slots.header" #header>
                    <slot name="header" :item="item" />
                  </template>
                  <template v-if="$slots.content" #content>
                    <slot name="content" :item="item" />
                  </template>
                  <template v-if="$slots.footer" #footer>
                    <slot name="footer" :item="item" />
                  </template>
                  <template v-if="$slots.loading" #loading>
                    <slot name="loading" :item="item" />
                  </template>
                </Bubble>
              </template>

              <template v-else>
                <slot name="item" v-bind="buildItemContext(item, index)">
                  <div
                    :class="ns.e('embedded-item')"
                    :data-item-type="resolveItemType(item, index)"
                  >
                    {{ resolveFallbackItemText(item, index) }}
                  </div>
                </slot>
              </template>
            </div>
          </template>
        </Virtualizer>
      </template>

      <div
        v-if="bottomBoundaryVisible"
        :class="[ns.e('boundary'), ns.em('boundary', 'bottom')]"
        :data-state="props.bottomStatus?.type"
      >
        <slot
          name="bottomStatus"
          v-bind="buildBoundaryContext('bottom', props.bottomStatus!)"
        >
          <div :class="ns.e('boundary-content')">
            <loadingBg
              v-if="props.bottomStatus?.type === 'loading'"
              :class="ns.e('boundary-loading')"
            />
            <span>{{
              resolveBoundaryText(props.bottomStatus!, 'bottom')
            }}</span>
          </div>
        </slot>
      </div>
    </div>

    <Transition name="elx-bubble-list-fade">
      <div
        v-if="showBackToBottom && hasVertical"
        :class="[
          ns.e('back-button'),
          $slots.backToBottom ? ns.em('back-button', 'slot') : ''
        ]"
        :style="{
          top: backButtonPosition.top,
          right: backButtonPosition.right,
          bottom: backButtonPosition.bottom,
          left: backButtonPosition.left,
          transform: backButtonPosition.transform
        }"
      >
        <slot
          v-if="$slots.backToBottom"
          name="backToBottom"
          v-bind="buildBackButtonContext()"
        />

        <button
          v-else
          type="button"
          :class="ns.e('back-to-bottom-default')"
          @click="handleBackButtonClick"
        >
          <el-icon
            :class="ns.e('back-to-bottom-icon')"
            :style="{ color: props.btnColor }"
          >
            <ArrowDownBold />
            <loadingBg
              v-if="props.btnLoading"
              :class="ns.e('back-to-bottom-loading')"
            />
          </el-icon>
        </button>
      </div>
    </Transition>
  </div>
</template>

<style scoped lang="scss" src="./style.scss"></style>
