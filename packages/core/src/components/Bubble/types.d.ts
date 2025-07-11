import type { TypewriterProps } from '../Typewriter/types';

export type BubbleProps = Pick<
  TypewriterProps,
  'renderer' | 'typing' | 'content'
> & {
  placement?: 'start' | 'end';
  avatar?: string;
  loading?: boolean;
  shape?: 'round' | 'corner';
  variant?: 'filled' | 'borderless' | 'outlined' | 'shadow';
  maxWidth?: string;
  avatarSize?: string;
  avatarGap?: string;
  avatarShape?: 'circle' | 'square';
  avatarSrcSet?: string;
  avatarAlt?: string;
  avatarFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
  noStyle?: boolean;
};

export interface BubbleEmits {
  (event: 'start', instance: TypewriterInstance): void;
  (event: 'finish', instance: TypewriterInstance): void;
  (event: 'writing', instance: TypewriterInstance): void;
  (event: 'avatarError', e: Event): void;
}
