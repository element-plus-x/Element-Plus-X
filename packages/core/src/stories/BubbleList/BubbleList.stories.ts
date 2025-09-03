import type BubbleListSource from '@components/BubbleList/index.vue';
import type { Meta, StoryObj } from '@storybook/vue3';
import { messageArr } from '@assets/mock';
import CustomSolt from './CustomSolt.vue';
import BubbleList from './index.vue';

const meta = {
  title: 'Example/BubbleList 气泡列表',
  component: BubbleList,
  tags: ['autodocs'],
  argTypes: {
    maxHeight: { control: 'text' },
    triggerIndices: { control: 'object' },
    alwaysShowScrollbar: { control: 'boolean' },
    showBackButton: { control: 'boolean' },
    backButtonPosition: { control: 'object' },
    backButtonThreshold: { control: 'number' },
    btnLoading: { control: 'boolean' },
    btnColor: { control: 'color' },
    btnIconSize: { control: 'number' }
  },
  args: {
    list: messageArr,
    maxHeight: '500px',
    triggerIndices: 'only-last',
    alwaysShowScrollbar: true,
    showBackButton: true,
    backButtonPosition: { bottom: '20px', left: 'calc(50% - 19px)' },
    backButtonThreshold: 80,
    btnLoading: true,
    btnColor: '#409EFF',
    btnIconSize: 24
  }
} satisfies Meta<typeof BubbleListSource>;

export default meta;

type Story = StoryObj<typeof meta>;

export const BubbleListDemo: Story = {
  args: {}
};

export const SoltDemo: Story = {
  args: {
    ...BubbleListDemo.args,
    content: '欢迎使用 Element Plus X',
    ismarkdown: false,
    list: messageArr?.map(item => ({
      ...item,
      noStyle: true
    }))
  } as Story['args'],
  render: (args: any) => ({
    components: {
      CustomSolt
    },
    setup() {
      return {
        attrs: args
      };
    },
    template: `<CustomSolt v-bind="attrs" />`
  })
};
