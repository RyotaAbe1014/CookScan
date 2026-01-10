import { TagCreateForm } from './tag-create-form'
import { CategoryItem } from './category-item'
import { TagInfoBanner } from './tag-info-banner'
import { TagEmptyState } from './tag-empty-state'
import type { TagCategoryWithTags } from '@/types/tag'
import { TagIcon } from '@/components/icons'

type TagPageContentProps = {
  tagCategories: TagCategoryWithTags[]
  currentUserId: string
}

export function TagPageContent({ tagCategories, currentUserId }: TagPageContentProps) {
  return (
    <div className="space-y-8">
      <TagInfoBanner />
      <TagCreateForm categories={tagCategories} />

      {/* タグ一覧セクション */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">登録済みのタグ</h2>
          <p className="mt-1 text-sm text-gray-600">カテゴリごとに整理されたタグ一覧</p>
        </div>
        {tagCategories.length > 0 && (
          <div className="flex items-center gap-2 rounded-lg bg-white px-4 py-2 shadow-sm">
            <TagIcon className="h-5 w-5 text-indigo-600" />
            <span className="text-sm font-medium text-gray-900">{tagCategories.length} カテゴリ</span>
          </div>
        )}
      </div>

      {tagCategories.length === 0 ? (
        <TagEmptyState />
      ) : (
        <div className="space-y-6">
          {tagCategories.map((category) => (
            <CategoryItem key={category.id} category={category} currentUserId={currentUserId} />
          ))}
        </div>
      )}
    </div>
  )
}
