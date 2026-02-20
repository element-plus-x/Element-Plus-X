import type BubbleSource from '@components/Bubble/index.vue';
import type { Meta, StoryObj } from '@storybook/vue3';
import { avatar1, mdContent } from '@assets/mock';
import CustomSolt from './CustomSolt.vue';
import Bubble from './index.vue';

const meta = {
  title: 'Example/Bubble 对话气泡',
  component: Bubble,
  tags: ['autodocs'],
  argTypes: {
    content: { control: 'text' },
    // 气泡属性
    placement: { control: 'radio', options: ['start', 'end'] },
    avatar: { control: 'text' },
    loading: { control: 'boolean' },
    shape: { control: 'radio', options: ['round', 'corner'] },
    variant: {
      control: 'radio',
      options: ['filled', 'borderless', 'outlined', 'shadow']
    },
    maxWidth: { control: 'text' },
    avatarSize: { control: 'text' },
    avatarGap: { control: 'text' },
    avatarShape: { control: 'radio', options: ['circle', 'square'] },
    avatarSrcSet: { control: 'text' },
    avatarAlt: { control: 'text' },
    avatarFit: {
      control: 'radio',
      options: ['cover', 'contain', 'fill', 'none', 'scale-down']
    },
    noStyle: { control: 'boolean' }
  },
  args: {
    avatar: avatar1,
    loading: false,
    content: mdContent,
    placement: 'start',
    shape: 'round',
    variant: 'filled',
    maxWidth: '500px',
    noStyle: false,
    avatarSize: '42px',
    avatarGap: '12px',
    avatarShape: 'circle',
    avatarSrcSet: `${avatar1}`,
    avatarAlt: 'avatar',
    avatarFit: 'cover'
  }
} satisfies Meta<typeof BubbleSource>;

export default meta;

type Story = StoryObj<typeof meta>;

export const BubbleDemo: Story = {
  args: {}
};

export const SoltDemo: Story = {
  args: {
    ...BubbleDemo.args,
    content: '欢迎使用 Element Plus X'
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
