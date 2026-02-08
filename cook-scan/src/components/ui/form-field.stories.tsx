import type { Meta, StoryObj } from '@storybook/nextjs'
import { FormField } from './form-field'
import { Input } from './input'
import { Select } from './select'
import { Textarea } from './textarea'
import { UserIcon } from '@/components/icons/user-icon'
import { MailIcon } from '@/components/icons/mail-icon'
import { TagIcon } from '@/components/icons/tag-icon'

const meta = {
  title: 'UI/FormField',
  component: FormField,
  tags: ['autodocs'],
  argTypes: {
    labelVariant: {
      control: 'select',
      options: ['default', 'semibold', 'compact'],
    },
    required: { control: 'boolean' },
  },
} satisfies Meta<typeof FormField>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    label: 'レシピ名',
    htmlFor: 'recipe-name',
    children: <Input id="recipe-name" placeholder="レシピ名を入力" />,
  },
}

export const Required: Story = {
  args: {
    label: 'メールアドレス',
    htmlFor: 'email',
    required: true,
    children: <Input id="email" type="email" placeholder="example@example.com" />,
  },
}

export const WithIcon: Story = {
  args: {
    label: 'ユーザー名',
    htmlFor: 'username',
    icon: <UserIcon />,
    children: <Input id="username" placeholder="ユーザー名" />,
  },
}

export const WithIconAndRequired: Story = {
  args: {
    label: 'メールアドレス',
    htmlFor: 'email-icon',
    icon: <MailIcon />,
    required: true,
    children: <Input id="email-icon" type="email" placeholder="example@example.com" />,
  },
}

export const Semibold: Story = {
  args: {
    label: 'タグ名',
    htmlFor: 'tag',
    labelVariant: 'semibold',
    icon: <TagIcon />,
    iconColorClass: 'text-amber-500',
    children: <Input id="tag" placeholder="タグ名を入力" />,
  },
}

export const Compact: Story = {
  args: {
    label: 'メモ',
    htmlFor: 'note',
    labelVariant: 'compact',
    children: <Input id="note" size="sm" placeholder="メモ" />,
  },
}

export const WithSelect: Story = {
  args: {
    label: 'カテゴリ',
    htmlFor: 'category',
    required: true,
    children: (
      <Select id="category">
        <option value="">選択してください</option>
        <option value="main">メイン</option>
        <option value="side">副菜</option>
        <option value="dessert">デザート</option>
      </Select>
    ),
  },
}

export const WithTextarea: Story = {
  args: {
    label: '説明',
    htmlFor: 'description',
    children: (
      <Textarea id="description" rows={4} placeholder="レシピの説明を入力..." />
    ),
  },
}

export const FormExample: Story = {
  args: {
    label: 'レシピ名',
    htmlFor: 'form-name',
    required: true,
    children: (
      <div className="flex w-96 flex-col gap-4">
        <FormField label="レシピ名" htmlFor="form-name" required>
          <Input id="form-name" placeholder="レシピ名を入力" />
        </FormField>
        <FormField label="カテゴリ" htmlFor="form-category" required>
          <Select id="form-category">
            <option value="">選択してください</option>
            <option value="main">メイン</option>
            <option value="side">副菜</option>
          </Select>
        </FormField>
        <FormField label="説明" htmlFor="form-desc">
          <Textarea id="form-desc" rows={3} placeholder="説明を入力..." />
        </FormField>
      </div>
    ),
  }
}
