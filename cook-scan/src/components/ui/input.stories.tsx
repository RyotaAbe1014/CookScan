import type { Meta, StoryObj } from 'storybook'
import { Input } from './input'

const meta = {
  title: 'UI/Input',
  component: Input,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'green', 'blue', 'disabled'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg', 'xl'],
    },
    hasIcon: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
} satisfies Meta<typeof Input>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    placeholder: 'テキストを入力...',
  },
}

export const Green: Story = {
  args: {
    variant: 'green',
    placeholder: '材料名を入力...',
  },
}

export const Blue: Story = {
  args: {
    variant: 'blue',
    placeholder: '手順を入力...',
  },
}

export const DisabledVariant: Story = {
  args: {
    variant: 'disabled',
    value: '読み取り専用',
    readOnly: true,
  },
}

export const WithIcon: Story = {
  args: {
    hasIcon: true,
    placeholder: '検索...',
  },
}

export const Small: Story = {
  args: {
    size: 'sm',
    placeholder: '小さい入力',
  },
}

export const ExtraLarge: Story = {
  args: {
    size: 'xl',
    placeholder: '大きい入力',
  },
}

export const Disabled: Story = {
  args: {
    disabled: true,
    placeholder: '無効な入力',
  },
}

export const AllVariants: Story = {
  render: () => (
    <div className="flex w-80 flex-col gap-4">
      <Input variant="default" placeholder="デフォルト" />
      <Input variant="green" placeholder="グリーン（材料）" />
      <Input variant="blue" placeholder="ブルー（手順）" />
      <Input variant="disabled" value="無効" readOnly />
    </div>
  ),
}

export const AllSizes: Story = {
  render: () => (
    <div className="flex w-80 flex-col gap-4">
      <Input size="sm" placeholder="Small" />
      <Input size="md" placeholder="Medium" />
      <Input size="lg" placeholder="Large" />
      <Input size="xl" placeholder="Extra Large" />
    </div>
  ),
}
