import type ThoughtChainSource from '@components/ThoughtChain/index.vue';
import type { ThoughtChainProps } from '@components/ThoughtChain/types';
import type { Meta, StoryObj } from '@storybook/vue3';
import { pick } from 'radash';
import ThoughtChainWithCustomIcon from './CustomIcon.vue';
import ThoughtChain from './index.vue';
import './index.scss';

const mockItems: ThoughtChainProps['thinkingItems'] = [
  {
    id: 1,
    title: 'Step 1',
    thinkTitle: 'Thinking about step one',
    thinkContent: 'Detailed explanation for **step one',
    status: 'success',
    isCanExpand: true,
    isDefaultExpand: false,
    isMarkdown: true
  },
  {
    id: 2,
    title: 'Step 2',
    thinkTitle: 'Thinking about step two',
    thinkContent: 'Here is what we know about step two.',
    status: 'loading',
    isCanExpand: true,
    isDefaultExpand: true,
    isMarkdown: false
  },
  {
    id: 3,
    title: 'Final Step',
    thinkTitle: 'Last step...',
    thinkContent: 'This is the **final step** of the process',
    status: 'error',
    isCanExpand: false,
    isMarkdown: true
  }
];

const meta: Meta<typeof ThoughtChainSource> = {
  title: 'Example/ThoughtChain 思维链',
  component: ThoughtChain,
  argTypes: {
    dotSize: {
      control: { type: 'radio' },
      options: ['small', 'default', 'large']
    },
    maxWidth: {
      control: { type: 'text' }
    },
    lineGradient: {
      control: { type: 'boolean' }
    },
    rowKey: {
      control: { type: 'text' },
      defaultValue: 'id',
      description: 'id字段名'
    },
    titleKey: {
      control: { type: 'text' },
      defaultValue: 'title',
      description: '标题字段名'
    },
    statusKey: {
      control: { type: 'text' },
      defaultValue: 'status',
      description: '状态字段名'
    },
    thinkContentKey: {
      control: { type: 'text' },
      defaultValue: 'content',
      description: '思考内容字段名'
    },
    thinkTitleKey: {
      control: { type: 'text' },
      defaultValue: 'title',
      description: '思考标题字段名'
    }
  },
  args: {
    thinkingItems: mockItems,
    maxWidth: '600px',
    rowKey: 'id',
    titleKey: 'title',
    thinkTitleKey: 'thinkTitle',
    thinkContentKey: 'thinkContent',
    statusKey: 'status',
    lineGradient: false,
    dotSize: 'default',
    dotBackgroundColor: {
      loading: '#f39c12',
      success: '#2ecc71',
      error: '#e74c3c'
    }
  }
} satisfies Meta<typeof ThoughtChainSource>;

export default meta;

type Story = StoryObj<typeof meta>;

export const ThoughtChainDemo: Story = {
  args: {
    lineGradient: false
  }
};

export const CustomIconDemo: Story = {
  args: {
    thinkingItems: mockItems,
    lineGradient: false
  },
  render: args => ({
    components: {
      ThoughtChainWithCustomIcon
    },
    setup() {
      const attrs = pick(args, [
        'thinkingItems',
        'lineGradient',
        'dotSize',
        'dotBackgroundColor',
        'rowKey',
        'titleKey',
        'thinkTitleKey',
        'thinkContentKey',
        'statusKey'
      ] as (keyof Story['args'])[]);
      return { attrs };
    },
    template: `<ThoughtChainWithCustomIcon v-bind="attrs" />`
  })
};
