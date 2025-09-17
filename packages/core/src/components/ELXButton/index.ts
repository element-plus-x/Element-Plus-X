import type { SetupContext } from 'vue';
import { buttonEmits, buttonProps } from 'element-plus';

export const elxButtonTypes = [
  'clear',
  'loading',
  'send',
  'speech',
  'speechLoading',
  ''
] as const;

export const elxButtonProps = {
  /**
   * @description xButton type
   */
  elxButtonType: {
    type: String,
    values: elxButtonTypes,
    default: ''
  },
  ...buttonProps
};

export const elxButtonEmits = {
  clear: (evt: MouseEvent) => evt instanceof MouseEvent,
  cancel: (evt: MouseEvent) => evt instanceof MouseEvent,
  submit: (evt: MouseEvent) => evt instanceof MouseEvent,
  ...buttonEmits
};

export type ELXButtonProps = Partial<ExtractPropTypes<typeof elxButtonProps>>;
export type ELXButtonEmits = typeof elxButtonEmits;
export type ELXButtonType = ELXButtonProps['elxButtonType'];

export function useButton(
  props: ELXButtonProps,
  emit: SetupContext<ELXButtonEmits>['emit']
) {
  const handleClick = (evt: MouseEvent) => {
    if (props.disabled || props.loading) {
      evt.stopPropagation();
      return;
    }
    if (props.elxButtonType?.trim()?.length) {
      if (props.elxButtonType === 'clear') {
        return emit('clear', evt);
      } else if (['loading', 'speechLoading'].includes(props.elxButtonType)) {
        return emit('cancel', evt);
      } else if (props.elxButtonType === 'send') {
        return emit('submit', evt);
      }
    }
    emit('click', evt);
  };

  return {
    handleClick
  };
}
