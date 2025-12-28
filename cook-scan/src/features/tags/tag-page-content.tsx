import { TagCreateForm } from './tag-create-form'
import { CategoryItem } from './category-item'
import { TagInfoBanner } from './tag-info-banner'
import { TagEmptyState } from './tag-empty-state'

type TagCategory = {
  id: string
  name: string
  description: string | null
  isSystem: boolean
  userId: string | null
  tags: Array<{
    id: string
    name: string
    description: string | null
    isSystem: boolean
    recipeTags: Array<{ recipeId: string }>
  }>
}

type TagPageContentProps = {
  tagCategories: TagCategory[]
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
              <svg className="h-5 w-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                />
              </svg>
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
