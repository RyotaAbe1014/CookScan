import Link from 'next/link'
import Image from 'next/image'
import type { RecipeBasic } from '@/types/recipe'
import { ClipboardListIcon } from '@/components/icons/clipboard-list-icon'
import { TagIcon } from '@/components/icons/tag-icon'
import { ClockIcon } from '@/components/icons/clock-icon'

type RecipeGridProps = {
  recipes: RecipeBasic[]
}

export function RecipeGrid({ recipes }: RecipeGridProps) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {recipes.map((recipe) => (
        <Link key={recipe.id} href={`/recipes/${recipe.id}`} className="group">
          <div className="relative overflow-hidden rounded-xl bg-white shadow-md ring-1 ring-gray-900/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
            {recipe.imageUrl && (
              <div className="relative h-48 overflow-hidden bg-gray-200">
                <Image
                  src={recipe.imageUrl}
                  alt={recipe.title}
                  width={400}
                  height={192}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent" />
              </div>
            )}
            <div className="p-5">
              <h3 className="text-lg font-bold text-gray-900 transition-colors group-hover:text-emerald-600">
                {recipe.title}
              </h3>
              <div className="mt-2 flex items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <ClipboardListIcon className="h-4 w-4 text-emerald-500" />
                  <span className="font-medium">{recipe.ingredients.length}</span>
                  <span className="text-gray-500">品目</span>
                </div>
              </div>
              {recipe.recipeTags.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {recipe.recipeTags.slice(0, 3).map((recipeTag) => (
                    <span
                      key={recipeTag.tagId}
                      className="inline-flex items-center gap-1 rounded-md bg-amber-50 px-2 py-1 text-xs font-medium text-amber-700 ring-1 ring-amber-200"
                    >
                      <TagIcon className="h-3 w-3" />
                      {recipeTag.tag.name}
                    </span>
                  ))}
                  {recipe.recipeTags.length > 3 && (
                    <span className="inline-flex items-center rounded-md bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600">
                      +{recipe.recipeTags.length - 3}
                    </span>
                  )}
                </div>
              )}
              <div className="mt-4 flex items-center gap-1.5 border-t border-gray-100 pt-3 text-xs text-gray-500">
                <ClockIcon className="h-3.5 w-3.5" />
                {new Date(recipe.createdAt).toLocaleDateString('ja-JP', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}
