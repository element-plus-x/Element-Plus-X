import type MentionSenderSource from '@components/MentionSender/index.vue';
import type { Meta, StoryObj } from '@storybook/vue3';
import CustomSolt from './CustomSolt.vue';
import MentionSender from './index.vue';

const meta: Meta<typeof MentionSenderSource> = {
  title: 'Example/MentionSender 提及输入框',
  component: MentionSender,
  argTypes: {
    modelValue: {
      defaultValue: '',
      control: 'text',
      description: '输入框的绑定值，使用 v-model 进行双向绑定。',
      // 隐藏 modelValue 属性
      table: { disable: true }
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
      options: ['enter', 'shiftEnter', 'cmdOrCtrlEnter', 'altEnter'],
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
    options: {
      defaultValue: [],
      control: { type: 'object' },
      description: '可以传入一个数组，用于定义提及选项列表。'
    },
    triggerStrings: {
      defaultValue: [],
      control: { type: 'object' },
      description: '触发指令的字符串数组。'
    },
    triggerPopoverOffset: {
      defaultValue: 8,
      control: 'number',
      description: '触发指令的弹框的间距。只能是数字类型，单位 px。'
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
    options: [
      {
        value: 'value1',
        label: '选项1'
      },
      {
        value: 'value2',
        label: '选项2',
        disabled: true
      },
      {
        value: 'value3',
        label: '选项3'
      }
    ],
    triggerPopoverOffset: 8,
    triggerPopoverPlacement: 'top'
  }
} satisfies Meta<typeof MentionSenderSource>;

export default meta;

type Story = StoryObj<typeof meta>;

export const MentionSenderDemo: Story = {
  render: (args: any) => ({
    components: { MentionSender },
    setup() {
      const model = ref(args.modelValue);

      // 同步回 Storybook 控制面板
      watch(model, val => {
        args.modelValue = val;
      });

      return {
        args,
        model
      };
    },
    template: `
      <MentionSender
        v-bind="args"
        v-model:modelValue="model"
      />
    `
  })
};

export const SlotDemo: Story = {
  render: (args: any) => ({
    components: { CustomSolt },
    setup() {
      const model = ref(args.modelValue);

      // 同步回 Storybook 控制面板
      watch(model, val => {
        args.modelValue = val;
      });

      return {
        args,
        model
      };
    },
    template: `
      <CustomSolt
        v-bind="args"
        v-model:modelValue="model"
      />
    `
  })
};
