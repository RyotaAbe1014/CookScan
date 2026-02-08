import type { Meta, StoryObj } from 'storybook'
import { Select } from './select'

const meta = {
  title: 'UI/Select',
  component: Select,
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
} satisfies Meta<typeof Select>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    children: (
      <>
        <option value="">選択してください</option>
        <option value="1">オプション 1</option>
        <option value="2">オプション 2</option>
        <option value="3">オプション 3</option>
      </>
    ),
  },
}

export const Green: Story = {
  args: {
    variant: 'green',
    children: (
      <>
        <option value="">単位を選択</option>
        <option value="g">g</option>
        <option value="ml">ml</option>
        <option value="個">個</option>
        <option value="大さじ">大さじ</option>
        <option value="小さじ">小さじ</option>
      </>
    ),
  },
}

export const Blue: Story = {
  args: {
    variant: 'blue',
    children: (
      <>
        <option value="">タイマーを設定</option>
        <option value="60">1分</option>
        <option value="300">5分</option>
        <option value="600">10分</option>
      </>
    ),
  },
}

export const WithOptgroup: Story = {
  args: {
    children: (
      <>
        <option value="">カテゴリを選択</option>
        <optgroup label="料理の種類">
          <option value="main">メイン</option>
          <option value="side">副菜</option>
          <option value="soup">スープ</option>
        </optgroup>
        <optgroup label="調理方法">
          <option value="fry">焼く</option>
          <option value="boil">煮る</option>
          <option value="steam">蒸す</option>
        </optgroup>
      </>
    ),
  },
}

export const Disabled: Story = {
  args: {
    disabled: true,
    children: (
      <>
        <option value="">選択できません</option>
      </>
    ),
  },
}

export const AllVariants: Story = {
  render: () => (
    <div className="flex w-80 flex-col gap-4">
      <Select variant="default">
        <option>デフォルト</option>
      </Select>
      <Select variant="green">
        <option>グリーン（材料）</option>
      </Select>
      <Select variant="blue">
        <option>ブルー（手順）</option>
      </Select>
    </div>
  ),
}

export const AllSizes: Story = {
  render: () => (
    <div className="flex w-80 flex-col gap-4">
      <Select size="sm">
        <option>Small</option>
      </Select>
      <Select size="md">
        <option>Medium</option>
      </Select>
      <Select size="lg">
        <option>Large</option>
      </Select>
      <Select size="xl">
        <option>Extra Large</option>
      </Select>
    </div>
  ),
}
