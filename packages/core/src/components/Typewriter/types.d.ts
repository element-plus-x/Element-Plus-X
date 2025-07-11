import type { Component, ComputedRef, Ref } from 'vue';

export interface TypingConfig {
  step?: number;
  interval?: number;
  suffix?: string;
  isRequestEnd?: boolean;
}
export interface TypingFogfig {
  bgColor?: string;
  width?: string;
}

export interface TypewriterProps {
  renderer?: Component;
  content?: string;
  typing?: boolean | TypingConfig;
}

export interface TypewriterEmits {
  (event: 'start', instance: TypewriterInstance): void;
  (event: 'writing', instance: TypewriterInstance): void;
  (event: 'finish', instance: TypewriterInstance): void;
}

export interface TypewriterInstance {
  interrupt: () => void;
  continue: () => void;
  restart: () => void;
  destroy: () => void;
  renderedContent: ComputedRef<string>;
  isTyping: Ref<boolean>;
  progress: ComputedRef<number>;
}
