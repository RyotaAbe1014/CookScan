import type { Meta, StoryObj } from 'storybook'
import { Card, CardHeader, CardContent } from './card'
import { BookOpenIcon } from '@/components/icons/book-open-icon'
import { TagIcon } from '@/components/icons/tag-icon'
import { ClockIcon } from '@/components/icons/clock-icon'

const meta = {
  title: 'UI/Card',
  component: Card,
  tags: ['autodocs'],
  argTypes: {
    hover: { control: 'boolean' },
  },
} satisfies Meta<typeof Card>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    children: (
      <CardContent>
        <p className="text-gray-700">カードのコンテンツです。</p>
      </CardContent>
    ),
  },
}

export const WithHover: Story = {
  args: {
    hover: true,
    children: (
      <CardContent>
        <p className="text-gray-700">ホバーでシャドウが変化します。</p>
      </CardContent>
    ),
  },
}

export const WithHeader: Story = {
  render: () => (
    <Card className="w-96">
      <CardHeader
        icon={<BookOpenIcon className="h-5 w-5 text-white" />}
        iconColor="emerald"
        title="レシピ詳細"
      />
      <CardContent>
        <p className="text-gray-700">レシピの詳細情報が入ります。</p>
      </CardContent>
    </Card>
  ),
}

export const IconColors: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      {(
        ['emerald', 'amber', 'green', 'blue', 'teal', 'red', 'purple', 'indigo'] as const
      ).map((color) => (
        <Card key={color} className="w-96">
          <CardHeader
            icon={<TagIcon className="h-5 w-5 text-white" />}
            iconColor={color}
            title={`${color}`}
          />
        </Card>
      ))}
    </div>
  ),
}

export const WithHeaderActions: Story = {
  render: () => (
    <Card className="w-96">
      <CardHeader
        icon={<ClockIcon className="h-5 w-5 text-white" />}
        iconColor="blue"
        title="調理手順"
        actions={
          <button className="rounded-md bg-primary px-3 py-1 text-xs text-white">
            編集
          </button>
        }
      />
      <CardContent>
        <ol className="list-decimal space-y-2 pl-5 text-sm text-gray-700">
          <li>材料を準備する</li>
          <li>鍋にお湯を沸かす</li>
          <li>材料を入れて煮込む</li>
        </ol>
      </CardContent>
    </Card>
  ),
}

export const ContentPadding: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <Card className="w-96">
        <CardContent padding="none">
          <div className="bg-muted p-2 text-sm text-gray-500">padding: none</div>
        </CardContent>
      </Card>
      <Card className="w-96">
        <CardContent padding="sm">
          <div className="text-sm text-gray-500">padding: sm</div>
        </CardContent>
      </Card>
      <Card className="w-96">
        <CardContent padding="md">
          <div className="text-sm text-gray-500">padding: md (default)</div>
        </CardContent>
      </Card>
      <Card className="w-96">
        <CardContent padding="lg">
          <div className="text-sm text-gray-500">padding: lg</div>
        </CardContent>
      </Card>
    </div>
  ),
}
