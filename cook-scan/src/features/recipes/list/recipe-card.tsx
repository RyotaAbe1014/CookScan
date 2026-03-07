import Image from 'next/image'
import { ClipboardListIcon } from '@/components/icons/clipboard-list-icon'
import { ClockIcon } from '@/components/icons/clock-icon'
import { TagIcon } from '@/components/icons/tag-icon'
import type { RecipeBasic } from '@/types/recipe'

type RecipeCardProps = {
  recipe: RecipeBasic
  badge?: React.ReactNode
}

function formatRecipeDate(date: Date) {
  return new Date(date).toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export function RecipeCard({ recipe, badge }: RecipeCardProps) {
  return (
    <article className="h-full overflow-hidden rounded-xl bg-white shadow-md ring-1 ring-card-border transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      {recipe.imageUrl && (
        <div className="relative h-40 overflow-hidden bg-section-header-border">
          <Image
            src={recipe.imageUrl}
            alt={recipe.title}
            width={400}
            height={160}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent" />
        </div>
      )}

      <div className="p-5">
        <div className="space-y-2">
          {badge}
          <h3 className="text-lg font-bold text-foreground transition-colors group-hover:text-primary">
            {recipe.title}
          </h3>
        </div>

        <div className="mt-2 flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <ClipboardListIcon className="h-4 w-4 text-primary" />
            <span className="font-medium">{recipe.ingredients.length}</span>
            <span className="text-muted-foreground">品目</span>
          </div>
        </div>

        {recipe.recipeTags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {recipe.recipeTags.slice(0, 3).map((recipeTag) => (
              <span
                key={recipeTag.tagId}
                className="inline-flex items-center gap-1 rounded-md bg-warning-light px-2 py-1 text-xs font-medium text-warning ring-1 ring-warning-light"
              >
                <TagIcon className="h-3 w-3" />
                {recipeTag.tag.name}
              </span>
            ))}
            {recipe.recipeTags.length > 3 && (
              <span className="inline-flex items-center rounded-md bg-muted px-2 py-1 text-xs font-medium text-muted-foreground">
                +{recipe.recipeTags.length - 3}
              </span>
            )}
          </div>
        )}

        <div className="mt-4 flex items-center gap-1.5 border-t border-muted pt-3 text-xs text-muted-foreground">
          <ClockIcon className="h-3.5 w-3.5" />
          {formatRecipeDate(recipe.createdAt)}
        </div>
      </div>
    </article>
  )
}
