import { Card, CardHeader, CardContent } from '@/components/ui/card'
import type { RecipeTag } from '@/types/recipe'
import { groupTagsByCategory } from './utils'
import { TagIcon } from '@/components/icons/tag-icon'

type RecipeTagsSectionProps = {
  recipeTags: RecipeTag[]
}

export function RecipeTagsSection({ recipeTags }: RecipeTagsSectionProps) {
  if (recipeTags.length === 0) {
    return null
  }

  const tagsByCategory = groupTagsByCategory(recipeTags)

  return (
    <Card className="mb-6">
      <CardHeader
        icon={
          <TagIcon className="h-5 w-5 text-white" />
        }
        iconColor="amber"
        title="タグ"
      />
      <CardContent>
        <div className="space-y-4">
          {[...tagsByCategory.entries()].map(([categoryId, category]) => (
            <div key={categoryId}>
              <div className="mb-2 flex items-center gap-2">
                <div className="h-1 w-1 rounded-full bg-amber-600" />
                <h4 className="text-sm font-semibold text-gray-900">{category.name}</h4>
              </div>
              <div className="flex flex-wrap gap-2">
                {category.tags.map((tag) => (
                  <span
                    key={tag.id}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-amber-100 px-3 py-2 text-sm font-medium text-amber-900 ring-1 ring-amber-300"
                  >
                    <TagIcon className="h-3.5 w-3.5" />
                    {tag.name}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
