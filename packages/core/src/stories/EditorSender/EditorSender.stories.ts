import type EditorSenderSource from '@components/EditorSender/index.vue';
import type { EditorProps } from '@components/EditorSender/types';
import type { Meta, StoryObj } from '@storybook/vue3';
import EditorSender from './index.vue';
import OtherEditorSender from './other.vue';

const meta: Meta<typeof EditorSenderSource> = {
  title: 'Example/EditorSender',
  argTypes: {
    placeholder: { control: 'text' },
    autoFocus: { control: 'boolean' },
    variant: { control: { type: 'select' }, options: ['default', 'updown'] },
    submitType: {
      control: { type: 'select' },
      options: ['enter', 'shiftEnter']
    },
    loading: { control: 'boolean' },
    disabled: { control: 'boolean' },
    clearable: { control: 'boolean' },
    headerAnimationTimer: { control: 'number' },
    mentionConfig: { control: 'object' }
  },
  args: {
    placeholder: '请输入内容',
    autoFocus: false,
    variant: 'updown',
    submitType: 'enter',
    loading: false,
    disabled: false,
    clearable: true,
    headerAnimationTimer: 300,
    customStyle: {
      maxHeight: '240px'
    },
    mentionConfig: {
      dialogTitle: '群成员',
      callEvery: true,
      options: [
        {
          id: '5',
          name: '张三丰',
          pinyin: 'zhang san feng'
        },
        {
          id: '1',
          name: '张三',
          pinyin: 'zhang san'
        },
        {
          id: '2',
          name: '李四',
          pinyin: 'li si'
        },
        {
          id: '3',
          name: '王五',
          pinyin: 'wang wu'
        },
        {
          id: '4',
          name: '马六',
          pinyin: 'ma liu'
        }
      ]
    },
    triggerConfig: [
      {
        dialogTitle: '群话题',
        key: '#',
        options: [
          {
            id: '1',
            name: '话题1'
          },
          {
            id: '2',
            name: '话题2'
          }
        ]
      }
    ]
  }
} satisfies Meta<typeof EditorSenderSource>;

export default meta;

type Story = StoryObj<typeof meta>;

export const EditorSenderDemo: Story = {
  render: (_args: EditorProps) => ({
    setup() {
      return {
        attrs: _args
      };
    },
    components: { EditorSender },
    template: `
      <EditorSender v-bind="attrs"
                    v-model:loading="attrs.loading" />
    `
  })
};

export const OtherEditorSenderDemo: Story = {
  render: (_args: EditorProps) => ({
    components: { OtherEditorSender },
    template: `
      <OtherEditorSender  />
    `
  })
};
