import Link from 'next/link'
import type { RecipeBasic } from '@/types/recipe'
import { RecipeCard } from './recipe-card'

type RecipeGridProps = {
  recipes: RecipeBasic[]
}

export function RecipeGrid({ recipes }: RecipeGridProps) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {recipes.map((recipe) => (
        <Link key={recipe.id} href={`/recipes/${recipe.id}`} className="group">
          <RecipeCard recipe={recipe} />
        </Link>
      ))}
    </div>
  )
}
