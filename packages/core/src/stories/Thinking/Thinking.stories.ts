import type ThinkingSource from '@components/Thinking/index.vue';
import type { Meta, StoryObj } from '@storybook/vue3';
import Thinking from './index.vue';

const meta = {
  title: 'Example/Thinking 思考中',
  component: Thinking,
  tags: ['autodocs'],
  argTypes: {
    modelValue: { control: 'boolean' },
    autoCollapse: { control: 'boolean' },
    duration: { control: 'text' },
    buttonWidth: { control: 'text' },
    maxWidth: { control: 'text' },
    backgroundColor: { control: 'color' },
    color: { control: 'color' }
  },
  args: {
    modelValue: true,
    autoCollapse: false,
    duration: '0.2s',
    buttonWidth: '160px',
    maxWidth: '500px',
    backgroundColor: '#fcfcfc',
    color: 'var(--el-color-info)'
  }
} satisfies Meta<typeof ThinkingSource>;

export default meta;
type Story = StoryObj<typeof meta>;
/*
 *👇 Render functions are a framework specific feature to allow you control on how the component renders.
 */
export const ThinkingDemo: Story = {
  args: {} as Story['args']
};
