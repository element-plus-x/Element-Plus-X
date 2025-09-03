import type AttachmentsSource from '@components/Attachments/index.vue';
import type { Meta, StoryObj } from '@storybook/vue3';
import CustomSolt from './CustomSolt.vue';
import Attachments from './index.vue';
import { genDefaultFiles } from './useAttachmentStubs.ts';

const meta: Meta = {
  title: 'Example/Attachments 附件上传组件',
  tags: ['autodocs'],
  component: Attachments,
  argTypes: {
    items: {
      control: 'object'
    },
    overflow: {
      control: 'radio',
      options: ['scrollX', 'scrollY', 'wrap']
    },
    listStyle: {
      control: 'object'
    },
    limit: {
      control: 'number'
    },
    hideUpload: {
      control: 'boolean'
    },
    uploadIconSize: {
      control: 'text'
    },
    dragTarget: {
      control: 'text'
    }
  },
  args: {
    items: genDefaultFiles(),
    overflow: 'scrollX',
    listStyle: {
      padding: '0 12px',
      height: '320px'
    },
    limit: 0,
    hideUpload: false,
    uploadIconSize: '64px',
    dragTarget: ''
  }
} satisfies Meta<typeof AttachmentsSource>;

export default meta;

type Story = StoryObj<typeof meta>;

export const AttachmentsDemo: Story = {
  args: {}
};

export const Solt: Story = {
  name: 'Solt Demo',
  args: {
    ...AttachmentsDemo.args,
    items: [
      { id: 1, name: '1.png' },
      { id: 2, name: '2.png' },
      { id: 3, name: '3.png' },
      { id: 4, name: '4.png' },
      { id: 5, name: '5.png' },
      { id: 6, name: '6.png' },
      { id: 7, name: '7.png' },
      { id: 8, name: '8.png' },
      { id: 9, name: '9.png' },
      { id: 10, name: '10.png' }
    ],
    listStyle: {
      padding: '0 12px',
      height: '220px'
    }
  } as Story['args'],
  render: args => ({
    components: {
      CustomSolt
    },
    setup() {
      return {
        attrs: args
      };
    },
    template: '<CustomSolt v-bind="attrs" />'
  })
};
