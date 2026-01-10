import { Card, CardHeader, CardContent } from '@/components/ui/card'
import type { RecipeTag } from '@/types/recipe'
import { groupTagsByCategory } from './utils'
import { TagIcon } from '@/components/icons'

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
                    className="inline-flex items-center gap-1.5 rounded-lg bg-linear-to-r from-indigo-600 to-purple-600 px-3 py-2 text-sm font-medium text-white shadow-lg shadow-indigo-500/30 ring-2 ring-indigo-600"
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
