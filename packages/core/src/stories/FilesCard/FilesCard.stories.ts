import type FilesCardSource from '@components/FilesCard/index.vue';
import type { Meta, StoryObj } from '@storybook/vue3';
import CustomSolt from './CustomSolt.vue';
import FilesCard from './index.vue';

const meta: Meta<typeof FilesCardSource> = {
  title: 'Example/FilesCard 文件卡片',
  component: FilesCard,
  parameters: {
    controls: {
      expanded: false // 单独控制是否展开组件描述详情
    }
  },
  argTypes: {
    uid: {
      control: 'text',
      description: '文件唯一标识符'
    },
    name: {
      control: 'text',
      description: '文件名（支持自动解析后缀匹配图标）'
    },
    fileSize: {
      control: 'number',
      description: '文件大小（单位：字节，自动转换为易读格式）'
    },
    fileType: {
      control: { type: 'radio' },
      options: [
        'word',
        'excel',
        'ppt',
        'pdf',
        'txt',
        'mark',
        'image',
        'audio',
        'video',
        'three',
        'code',
        'database',
        'link',
        'zip',
        'file',
        'unknown'
      ],
      description: '文件类型（优先级高于 name 后缀解析，如image、document）'
    },
    description: {
      control: 'text',
      description: '描述文本（支持动态生成文件类型和大小信息）'
    },
    url: {
      control: 'text',
      description: '文件访问地址（图片文件可用于预览）'
    },
    thumbUrl: {
      control: 'text',
      description: '图片缩略图地址'
    },
    imgFile: {
      control: 'file',
      description: '图片文件流（自动解析为预览地址，仅用于上传前临时展示）'
    },
    iconSize: {
      control: 'text',
      description: '图标/图片尺寸'
    },
    iconColor: {
      control: 'color',
      description: '非图片文件的图标颜色（支持自定义色值）'
    },
    showDelIcon: {
      control: 'boolean',
      description: '是否显示悬停删除图标',
      defaultValue: true
    },
    maxWidth: {
      control: 'text',
      description: '卡片最大宽度'
    },
    style: {
      control: 'object',
      description: '卡片自定义样式'
    },
    hoverStyle: {
      control: 'object',
      description: '卡片悬停时的自定义样式'
    },
    imgVariant: {
      control: { type: 'radio' },
      options: ['rectangle', 'square'],
      description: '图片卡片形态（长方形/正方形）'
    },
    imgPreview: {
      control: 'boolean',
      defaultValue: true,
      description: '是否开启图片预览功能'
    },
    imgPreviewMask: {
      control: 'boolean',
      description: '是否显示图片预览遮罩蒙层',
      defaultValue: true
    },
    status: {
      control: { type: 'radio' },
      options: ['uploading', 'done', 'error'],
      description: '文件状态（控制进度条、错误提示等视觉反馈）'
    },
    percent: {
      control: 'number',
      min: 0,
      max: 100,
      step: 1, // 可选：步进值
      description: '上传进度百分比'
    },
    errorTip: {
      control: 'text',
      defaultValue: '上传失败',
      description: '错误状态自定义提示文本'
    }
  }
} satisfies Meta<typeof FilesCardSource>;

export default meta;

type Story = StoryObj<typeof meta>;

export const FilesCardDemo: Story = {
  args: {
    name: '自定义.zdy',
    fileSize: 6000,
    iconSize: '60px',
    iconColor: '',
    fileType: 'word',
    maxWidth: '300px',
    errorTip: '上传失败',
    imgVariant: 'rectangle',
    imgPreview: true,
    imgPreviewMask: true,
    showDelIcon: true,
    status: 'uploading',
    percent: 30
  }
};

export const StyleSoltDemo: Story = {
  args: {
    ...FilesCardDemo.args,
    name: '自定义样式.doc',
    style: {
      'background-color': '#f0f9eb',
      border: '2px solid #67c23a',
      'border-radius': '20px'
    },
    hoverStyle: {
      'box-shadow': '0 2px 12px 0 rgba(0, 0, 0, 0.1)',
      'border-color': 'red',
      'background-color': 'rgba(255, 0, 0, 0.1)'
    }
  },
  render: args => ({
    components: {
      CustomSolt
    },
    setup() {
      return { attrs: args };
    },
    template: `<CustomSolt v-bind="attrs" />`
  })
};
