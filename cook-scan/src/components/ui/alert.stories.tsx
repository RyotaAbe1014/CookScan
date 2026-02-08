import type { Meta, StoryObj } from '@storybook/nextjs'
import { Alert } from './alert'

const meta = {
  title: 'UI/Alert',
  component: Alert,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['error', 'success', 'warning', 'info'],
    },
    hideIcon: { control: 'boolean' },
  },
} satisfies Meta<typeof Alert>

export default meta
type Story = StoryObj<typeof meta>

export const Info: Story = {
  args: {
    variant: 'info',
    children: 'レシピの画像をアップロードすると、AIが自動的にテキストを抽出します。',
  },
}

export const Success: Story = {
  args: {
    variant: 'success',
    children: 'レシピが正常に保存されました。',
  },
}

export const Warning: Story = {
  args: {
    variant: 'warning',
    children: '画像の品質が低い場合、抽出結果が不正確になる可能性があります。',
  },
}

export const Error: Story = {
  args: {
    variant: 'error',
    children: 'レシピの保存中にエラーが発生しました。もう一度お試しください。',
  },
}

export const HideIcon: Story = {
  args: {
    variant: 'info',
    hideIcon: true,
    children: 'アイコンなしのアラートです。',
  },
}

export const AllVariants: Story = {
  render: () => (
    <div className="flex w-96 flex-col gap-4">
      <Alert variant="info">情報メッセージ</Alert>
      <Alert variant="success">成功メッセージ</Alert>
      <Alert variant="warning">警告メッセージ</Alert>
      <Alert variant="error">エラーメッセージ</Alert>
    </div>
  ),
}
