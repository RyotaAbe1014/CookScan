import type { Meta, StoryObj } from 'storybook'
import { Button } from './button'
import { PlusIcon } from '@/components/icons/plus-icon'
import { TrashIcon } from '@/components/icons/trash-icon'

const meta = {
  title: 'UI/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'ghost', 'danger', 'danger-ghost', 'link'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg', 'icon'],
    },
    isLoading: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

export const Primary: Story = {
  args: {
    variant: 'primary',
    children: 'プライマリ',
  },
}

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    children: 'セカンダリ',
  },
}

export const Ghost: Story = {
  args: {
    variant: 'ghost',
    children: 'ゴースト',
  },
}

export const Danger: Story = {
  args: {
    variant: 'danger',
    children: '削除',
  },
}

export const DangerGhost: Story = {
  args: {
    variant: 'danger-ghost',
    children: '削除',
  },
}

export const Link: Story = {
  args: {
    variant: 'link',
    children: 'リンク',
  },
}

export const Small: Story = {
  args: {
    size: 'sm',
    children: '小さいボタン',
  },
}

export const Large: Story = {
  args: {
    size: 'lg',
    children: '大きいボタン',
  },
}

export const Loading: Story = {
  args: {
    isLoading: true,
    children: '読み込み中...',
  },
}

export const Disabled: Story = {
  args: {
    disabled: true,
    children: '無効',
  },
}

export const WithIcon: Story = {
  args: {
    children: (
      <>
        <PlusIcon className="h-4 w-4" />
        新規作成
      </>
    ),
  },
}

export const IconButton: Story = {
  args: {
    size: 'icon',
    variant: 'danger-ghost',
    'aria-label': '削除',
    children: <TrashIcon className="h-5 w-5" />,
  },
}

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-4">
      <Button variant="primary">プライマリ</Button>
      <Button variant="secondary">セカンダリ</Button>
      <Button variant="ghost">ゴースト</Button>
      <Button variant="danger">デンジャー</Button>
      <Button variant="danger-ghost">デンジャーゴースト</Button>
      <Button variant="link">リンク</Button>
    </div>
  ),
}

export const AllSizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Button size="sm">Small</Button>
      <Button size="md">Medium</Button>
      <Button size="lg">Large</Button>
      <Button size="icon" aria-label="アイコン">
        <PlusIcon className="h-5 w-5" />
      </Button>
    </div>
  ),
}
