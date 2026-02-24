import type XSenderSource from '@components/XSender/index.vue';
import type { XSenderProps } from '@components/XSender/types';
import type { Meta, StoryObj } from '@storybook/vue3';
import XSender from './index.vue';

const meta: Meta<typeof XSenderSource> = {
  title: 'Example/XSender 输入框',
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
    mentionConfig: { control: 'object' },
    triggerConfig: { control: 'object' },
    selectConfig: { control: 'object' }
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
    ],
    selectConfig: [
      {
        dialogTitle: '风格单选',
        key: 'style-single',
        options: [
          {
            id: '1',
            name: '人像摄影',
            preview: 'https://jianfv.top/style/style1.webp'
          },
          {
            id: '2',
            name: '电影写真',
            preview: 'https://jianfv.top/style/style2.webp'
          },
          {
            id: '3',
            name: '中国风',
            preview: 'https://jianfv.top/style/style3.webp'
          }
        ]
      },
      {
        dialogTitle: '风格多选',
        key: 'style-multiple',
        options: [
          {
            id: '1',
            name: '人像摄影',
            preview: 'https://jianfv.top/style/style1.webp'
          },
          {
            id: '2',
            name: '电影写真',
            preview: 'https://jianfv.top/style/style2.webp'
          },
          {
            id: '3',
            name: '中国风',
            preview: 'https://jianfv.top/style/style3.webp'
          }
        ],
        multiple: true,
        emptyText: '请选择风格标签'
      }
    ]
  }
} satisfies Meta<typeof XSenderSource>;

export default meta;

type Story = StoryObj<typeof meta>;

export const XSenderDemo: Story = {
  render: (_args: XSenderProps) => ({
    setup() {
      return {
        attrs: _args
      };
    },
    components: { XSender },
    template: `
      <XSender v-bind="attrs"
               v-model:loading="attrs.loading" />
    `
  })
};
