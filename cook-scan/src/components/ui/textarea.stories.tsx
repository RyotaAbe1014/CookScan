import type { Meta, StoryObj } from 'storybook'
import { Textarea } from './textarea'

const meta = {
  title: 'UI/Textarea',
  component: Textarea,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'green', 'blue'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg', 'xl'],
    },
    disabled: { control: 'boolean' },
  },
} satisfies Meta<typeof Textarea>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    placeholder: 'テキストを入力...',
    rows: 4,
  },
}

export const Green: Story = {
  args: {
    variant: 'green',
    placeholder: '材料のメモを入力...',
    rows: 4,
  },
}

export const Blue: Story = {
  args: {
    variant: 'blue',
    placeholder: '調理手順を入力...',
    rows: 4,
  },
}

export const Disabled: Story = {
  args: {
    disabled: true,
    value: '無効なテキストエリア',
    rows: 4,
  },
}

export const AllVariants: Story = {
  render: () => (
    <div className="flex w-80 flex-col gap-4">
      <Textarea variant="default" placeholder="デフォルト" rows={3} />
      <Textarea variant="green" placeholder="グリーン（材料）" rows={3} />
      <Textarea variant="blue" placeholder="ブルー（手順）" rows={3} />
    </div>
  ),
}

export const AllSizes: Story = {
  render: () => (
    <div className="flex w-80 flex-col gap-4">
      <Textarea size="sm" placeholder="Small" rows={2} />
      <Textarea size="md" placeholder="Medium" rows={2} />
      <Textarea size="lg" placeholder="Large" rows={2} />
      <Textarea size="xl" placeholder="Extra Large" rows={2} />
    </div>
  ),
}
