import { Card, CardHeader, CardContent } from '@/components/ui/card'
import { TagIcon } from '@/components/icons/tag-icon'
import { CheckSolidIcon } from '@/components/icons/check-solid-icon'
import type { RecipeFormTagCategory } from '@/features/recipes/types/tag'

type Props = {
  tagCategories: RecipeFormTagCategory[]
  selectedTagIds: string[]
  onToggleTag: (tagId: string) => void
}

export function TagSection({ tagCategories, selectedTagIds, onToggleTag }: Props) {
  if (tagCategories.length === 0) return null

  return (
    <Card>
      <CardHeader
        icon={<TagIcon className="h-5 w-5 text-white" />}
        iconColor="amber"
        title="タグ"
      />
      <CardContent>
        <div className="space-y-4">
          {tagCategories.map((category) => (
            <div key={category.id}>
              <div className="mb-2 flex items-center gap-2">
                <div className="h-1 w-1 rounded-full bg-amber-600" />
                <h4 className="text-sm font-semibold text-gray-900">{category.name}</h4>
              </div>
              {category.tags.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {category.tags.map((tag) => (
                    <label
                      key={tag.id}
                      className={`inline-flex cursor-pointer items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 ${selectedTagIds.includes(tag.id)
                        ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/30 ring-2 ring-indigo-600'
                        : 'bg-gray-100 text-gray-700 ring-1 ring-gray-200 hover:bg-gray-200 hover:ring-gray-300'
                        }`}
                    >
                      <input
                        type="checkbox"
                        checked={selectedTagIds.includes(tag.id)}
                        onChange={() => onToggleTag(tag.id)}
                        className="sr-only"
                      />
                      {selectedTagIds.includes(tag.id) && (
                        <CheckSolidIcon className="h-3.5 w-3.5" />
                      )}
                      <span>{tag.name}</span>
                    </label>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">このカテゴリにはタグがありません</p>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
