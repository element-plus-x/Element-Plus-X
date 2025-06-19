import type SenderSource from '@components/Sender/index.vue';
import type { Meta, StoryObj } from '@storybook/vue3';
import Sender from './index.vue';
import SenderSlot from './sender-slot.vue';

const meta: Meta<typeof SenderSource> = {
  title: 'Example/Sender',
  component: Sender,
  argTypes: {
    modelValue: {
      defaultValue: '',
      control: 'text',
      description: '输入框的绑定值，使用 v-model 进行双向绑定。'
    },
    placeholder: {
      defaultValue: '',
      control: 'text',
      description: '输入框的提示语文本。'
    },
    autoSize: {
      defaultValue: { minRows: 1, maxRows: 6 },
      control: 'object',
      description: '设置输入框的最小展示行数和最大展示行数。'
    },
    readOnly: {
      defaultValue: false,
      control: 'boolean',
      description: '输入框是否为只读状态。'
    },
    disabled: {
      defaultValue: false,
      control: 'boolean',
      description: '输入框是否为禁用状态。'
    },
    submitBtnDisabled: {
      defaultValue: false,
      control: 'boolean',
      description: '内置发送按钮禁用状态。(注意使用场景)'
    },
    loading: {
      defaultValue: false,
      control: 'boolean',
      description: '是否显示加载状态。为 true 时，输入框会显示加载动画。'
    },
    clearable: {
      defaultValue: false,
      control: 'boolean',
      description: '输入框是否可清空内容。展示默认清空按钮。'
    },
    allowSpeech: {
      defaultValue: false,
      control: 'boolean',
      description:
        '是否允许语音输入。默认展示内置语音识别按钮，内置浏览器内置语音识别 API。'
    },
    submitType: {
      defaultValue: 'enter',
      control: { type: 'select' },
      options: ['enter', 'shiftEnter'],
      description: '提交方式，支持 "shiftEnter"（按 Shift + Enter 提交）。'
    },
    headerAnimationTimer: {
      defaultValue: 300,
      control: 'number',
      description: '输入框的自定义头部显示时长，单位为 ms。'
    },
    inputWidth: {
      control: 'text',
      description: '输入框的宽度。'
    },
    variant: {
      defaultValue: 'default',
      control: { type: 'select' },
      options: ['default', 'updown'],
      description: '输入框的变体类型，支持 "default"、"updown"。'
    },
    showUpdown: {
      defaultValue: true,
      control: 'boolean',
      description: '当变体为 updown 时，是否展示内置样式。'
    },
    inputStyle: {
      defaultValue: {},
      control: 'object',
      description: '输入框的样式。'
    },
    triggerStrings: {
      defaultValue: [],
      control: 'array',
      description: '触发指令的字符串数组。'
    },
    triggerPopoverVisible: {
      defaultValue: false,
      control: 'boolean',
      description:
        '触发指令的弹框是否可见。需要使用 v-model:triggerPopoverVisible 进行控制。'
    },
    triggerPopoverWidth: {
      defaultValue: 'fit-content',
      control: 'text',
      description: '触发指令的弹框的宽度。可使用百分比等 css 单位。'
    },
    triggerPopoverLeft: {
      defaultValue: '0px',
      control: 'text',
      description: '触发指令的弹框的左边距。可使用百分比等 css 单位。'
    },
    triggerPopoverOffset: {
      defaultValue: 8,
      control: 'number',
      description: '触发指令的弹框的左边距。只能是数字类型，单位 px。'
    },
    triggerPopoverPlacement: {
      defaultValue: 'top-start',
      control: { type: 'select' },
      options: [
        'top',
        'top-start',
        'top-end',
        'bottom',
        'bottom-start',
        'bottom-end',
        'left',
        'left-start',
        'left-end',
        'right',
        'right-start',
        'right-end'
      ],
      description: '触发指令的弹框的位置。'
    },
    senderLineGradientColor: {
      control: 'text',
      description: 'sender 输入框的边框渐变颜色。',
      defaultValue:
        'linear-gradient(125deg, #ff6ec5, #7873f5, #08995de0, #0048ff,#ff6ec5)'
    }
  },
  args: {
    modelValue: '',
    placeholder: '请输入内容',
    autoSize: {
      minRows: 1,
      maxRows: 5
    },
    readOnly: false,
    disabled: false,
    submitBtnDisabled: false,
    loading: false,
    clearable: true,
    allowSpeech: true,
    submitType: 'enter',
    headerAnimationTimer: 300,
    inputWidth: '100%',
    variant: 'default',
    showUpdown: true,
    inputStyle: {
      color: '#626aef',
      fontSize: '14px',
      fontWeight: 700
    },
    triggerStrings: ['@', '/'],
    triggerPopoverWidth: '400px',
    triggerPopoverLeft: '0px',
    triggerPopoverOffset: 8,
    triggerPopoverPlacement: 'top',
    senderLineGradientColor:
      'linear-gradient(125deg, #ff6ec5, #7873f5, #08995de0, #0048ff,#ff6ec5)'
  }
} satisfies Meta<typeof SenderSource>;

export default meta;

type Story = StoryObj<typeof meta>;

export const SenderDemo: Story = {
  render: (args: { modelValue: any; triggerPopoverVisible: boolean }) => ({
    components: { Sender },
    setup() {
      const model = ref(args.modelValue);
      const triggerVisible = ref(args.triggerPopoverVisible);

      // 同步回 Storybook 控制面板
      watch(model, val => {
        args.modelValue = val;
      });
      watch(triggerVisible, val => {
        args.triggerPopoverVisible = val;
      });

      return {
        args,
        model,
        triggerVisible
      };
    },
    template: `
      <Sender
        v-bind="args"
        v-model:modelValue="model"
        v-model:triggerPopoverVisible="triggerVisible"
      />
    `
  })
};

export const SenderSlotDemo: Story = {
  render: (args: { modelValue: any; triggerPopoverVisible: boolean }) => ({
    components: { SenderSlot },
    setup() {
      const model = ref(args.modelValue);
      const triggerVisible = ref(args.triggerPopoverVisible);

      // 同步回 Storybook 控制面板
      watch(model, val => {
        args.modelValue = val;
      });
      watch(triggerVisible, val => {
        args.triggerPopoverVisible = val;
      });

      return {
        args,
        model,
        triggerVisible
      };
    },
    template: `
      <SenderSlot
        v-bind="args"
        v-model:modelValue="model"
        v-model:triggerPopoverVisible="triggerVisible"
      />
    `
  })
};
