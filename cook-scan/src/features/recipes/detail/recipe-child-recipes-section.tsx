import Link from 'next/link'
import { Card, CardHeader, CardContent } from '@/components/ui/card'
import { FolderIcon } from '@/components/icons/folder-icon'
import { ChevronRightIcon } from '@/components/icons/chevron-right-icon'
import type { ChildRecipeRelation } from '@/types/recipe'

type RecipeChildRecipesSectionProps = {
  childRecipes: ChildRecipeRelation[]
}

export function RecipeChildRecipesSection({ childRecipes }: RecipeChildRecipesSectionProps) {
  if (childRecipes.length === 0) {
    return null
  }

  return (
    <Card className="mb-8">
      <CardHeader
        icon={<FolderIcon className="h-5 w-5 text-white" />}
        iconColor="purple"
        title="構成要素"
      />
      <CardContent>
        <div className="space-y-2">
          {childRecipes.map((relation) => (
            <Link
              key={relation.id}
              href={`/recipes/${relation.childRecipeId}`}
              className="flex items-center justify-between rounded-lg bg-linear-to-r from-purple-50 to-white p-3 ring-1 ring-purple-200 transition-all hover:shadow-md"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-purple-500" />
                  <span className="font-semibold text-gray-900">
                    {relation.childRecipe.title}
                  </span>
                </div>
                {(relation.quantity || relation.notes) && (
                  <div className="ml-4 mt-1 flex items-center gap-3 text-sm text-gray-500">
                    {relation.quantity && <span>{relation.quantity}</span>}
                    {relation.notes && <span>{relation.notes}</span>}
                  </div>
                )}
              </div>
              <ChevronRightIcon className="h-4 w-4 text-gray-400" />
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
