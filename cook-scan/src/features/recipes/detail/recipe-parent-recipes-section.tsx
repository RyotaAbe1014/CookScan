import Link from 'next/link'
import { Card, CardHeader, CardContent } from '@/components/ui/card'
import { LinkIcon } from '@/components/icons/link-icon'
import { ChevronRightIcon } from '@/components/icons/chevron-right-icon'
import type { ParentRecipeRelation } from '@/types/recipe'

type RecipeParentRecipesSectionProps = {
  parentRecipes: ParentRecipeRelation[]
}

export function RecipeParentRecipesSection({ parentRecipes }: RecipeParentRecipesSectionProps) {
  if (parentRecipes.length === 0) {
    return null
  }

  return (
    <Card className="mb-6">
      <CardHeader
        icon={<LinkIcon className="h-5 w-5 text-white" />}
        iconColor="indigo"
        title="このレシピを使用しているレシピ"
      />
      <CardContent>
        <div className="space-y-2">
          {parentRecipes.map((relation) => (
            <Link
              key={relation.id}
              href={`/recipes/${relation.parentRecipeId}`}
              className="flex items-center justify-between rounded-lg bg-linear-to-r from-indigo-50 to-white p-3 ring-1 ring-indigo-200 transition-all hover:shadow-md"
            >
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-indigo-500" />
                <span className="font-semibold text-gray-900">
                  {relation.parentRecipe.title}
                </span>
              </div>
              <ChevronRightIcon className="h-4 w-4 text-gray-400" />
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
