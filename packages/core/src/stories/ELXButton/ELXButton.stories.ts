import type ELXButtonSource from '@components/ELXButton/index.vue';
import type { Meta, StoryObj } from '@storybook/vue3';
import ELXButtonSlot from './ELXButtonSlot.vue';
import ELXButton from './index.vue';

const meta: Meta<typeof ELXButtonSource> = {
  title: 'Example/ELXButton',
  component: ELXButton,
  argTypes: {
    size: {
      control: { type: 'select' },
      options: ['large', 'default', 'small']
    },
    disabled: {
      control: 'boolean'
    },
    loading: {
      control: 'boolean'
    }
  },
  args: {
    type: ''
  }
} satisfies Meta<typeof ELXButtonSource>;

export default meta;

type Story = StoryObj<typeof meta>;

export const ELXButtonDemo: Story = {
  render: _args => ({
    setup() {
      return {
        attrs: _args
      };
    },
    components: { ELXButton },
    template: `
      <ELXButton v-bind="attrs" />
    `
  })
};

export const ELXButtonSlotDemo: Story = {
  argTypes: {
    type: {
      control: { type: 'select' },
      options: ['primary', 'success', 'warning', 'danger', 'info']
    },
    round: {
      control: 'boolean'
    },
    circle: {
      control: 'boolean'
    },
    color: {
      control: 'text'
    },
    icon: {
      control: 'text'
    }
  },
  args: {
    type: 'primary'
  },
  render: _args => ({
    setup() {
      return {
        attrs: _args
      };
    },
    components: { ELXButtonSlot },
    template: `
      <ELXButtonSlot v-bind="attrs" />
    `
  })
};
