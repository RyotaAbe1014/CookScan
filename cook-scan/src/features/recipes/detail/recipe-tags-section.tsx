import { Card, CardHeader, CardContent } from '@/components/ui/card'
import { groupTagsByCategory } from './utils'

type RecipeTag = {
  tagId: string
  tag: {
    id: string
    name: string
    category: {
      id: string
      name: string
    }
  }
}

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
          <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
            />
          </svg>
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
                    className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 px-3 py-2 text-sm font-medium text-white shadow-lg shadow-indigo-500/30 ring-2 ring-indigo-600"
                  >
                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                      />
                    </svg>
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
