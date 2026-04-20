import type { MessageItem } from '@assets/mock';
import { avatar1, avatar2, messageArr } from '@assets/mock';

export type StoryRole = Extract<MessageItem['role'], 'ai' | 'user'>;

export function cloneStoryMessages(
  source: MessageItem[] = messageArr
): MessageItem[] {
  return source.map(item => ({
    ...item,
    loading: false
  }));
}

export function getLastMessageKey(source: MessageItem[]): number {
  return source.reduce((max, item) => {
    return typeof item.key === 'number' && Number.isFinite(item.key)
      ? Math.max(max, item.key)
      : max;
  }, 0);
}

export function createStoryMessage(
  key: number,
  role: StoryRole,
  content: string,
  overrides: Partial<MessageItem> = {}
): MessageItem {
  const isUser = role === 'user';

  return {
    key,
    role,
    placement: isUser ? 'end' : 'start',
    content,
    loading: false,
    shape: 'corner',
    variant: isUser ? 'outlined' : 'filled',
    avatar: isUser ? avatar1 : avatar2,
    avatarSize: '32px',
    ...overrides
  };
}

export function createStorySequence({
  startKey,
  count,
  label,
  startRole = 'ai'
}: {
  startKey: number;
  count: number;
  label: string;
  startRole?: StoryRole;
}): MessageItem[] {
  return Array.from({ length: count }, (_, offset) => {
    const role =
      startRole === 'ai'
        ? offset % 2 === 0
          ? 'ai'
          : 'user'
        : offset % 2 === 0
          ? 'user'
          : 'ai';

    const step = offset + 1;
    const content =
      role === 'user'
        ? `${label} 用户消息 ${step}：用于验证滚动位置、回底按钮和分页触发。`
        : `${label} AI 回复 ${step}：这条消息会刻意保持不同长度，用来验证变高气泡、虚拟列表测量与自动跟随是否稳定。`.repeat(
            step % 3 === 0 ? 2 : 1
          );

    return createStoryMessage(startKey + offset, role, content);
  });
}

export function createStorySeed(
  source?: MessageItem[],
  extraCount = 0,
  label = '扩展示例'
): MessageItem[] {
  const base = cloneStoryMessages(source ?? messageArr);

  if (extraCount <= 0) {
    return base;
  }

  return [
    ...base,
    ...createStorySequence({
      startKey: getLastMessageKey(base) + 1,
      count: extraCount,
      label,
      startRole: 'ai'
    })
  ];
}
