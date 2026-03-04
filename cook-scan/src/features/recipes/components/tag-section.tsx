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
        iconColor="accent-tags"
        title="タグ"
      />
      <CardContent>
        <div className="space-y-4">
          {tagCategories.map((category) => (
            <div key={category.id}>
              <div className="mb-2 flex items-center gap-2">
                <div className="h-1 w-1 rounded-full bg-warning" />
                <h4 className="text-sm font-semibold text-foreground">{category.name}</h4>
              </div>
              {category.tags.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {category.tags.map((tag) => (
                    <label
                      key={tag.id}
                      className={`inline-flex cursor-pointer items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 ${selectedTagIds.includes(tag.id)
                        ? 'bg-primary text-white shadow-lg shadow-primary/30 ring-2 ring-primary'
                        : 'bg-muted text-foreground ring-1 ring-section-header-border hover:bg-section-header-border hover:ring-border-dark'
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
                <p className="text-sm text-muted-foreground">このカテゴリにはタグがありません</p>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
