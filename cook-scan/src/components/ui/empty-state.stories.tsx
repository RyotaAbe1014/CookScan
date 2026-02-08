import type { Meta, StoryObj } from '@storybook/nextjs'
import { EmptyState } from './empty-state'
import { Button } from './button'
import { BookOpenIcon } from '@/components/icons/book-open-icon'
import { TagIcon } from '@/components/icons/tag-icon'
import { SearchIcon } from '@/components/icons/search-icon'
import { CameraIcon } from '@/components/icons/camera-icon'

const meta = {
  title: 'UI/EmptyState',
  component: EmptyState,
  tags: ['autodocs'],
} satisfies Meta<typeof EmptyState>

export default meta
type Story = StoryObj<typeof meta>

export const NoRecipes: Story = {
  args: {
    icon: <BookOpenIcon className="h-10 w-10 text-muted-foreground" />,
    title: 'レシピがありません',
    description: 'まだレシピが登録されていません。最初のレシピを作成してみましょう。',
    action: <Button>レシピを作成</Button>,
  },
}

export const NoTags: Story = {
  args: {
    icon: <TagIcon className="h-10 w-10 text-muted-foreground" />,
    title: 'タグがありません',
    description: 'タグを作成してレシピを整理しましょう。',
    action: <Button>タグを作成</Button>,
  },
}

export const NoSearchResults: Story = {
  args: {
    icon: <SearchIcon className="h-10 w-10 text-muted-foreground" />,
    title: '検索結果がありません',
    description: '検索条件に一致するレシピが見つかりませんでした。別のキーワードで試してみてください。',
  },
}

export const NoImages: Story = {
  args: {
    icon: <CameraIcon className="h-10 w-10 text-muted-foreground" />,
    title: '画像がありません',
    description: 'レシピの写真をアップロードすると、AIが自動的にテキストを抽出します。',
    action: <Button variant="secondary">画像をアップロード</Button>,
  },
}
