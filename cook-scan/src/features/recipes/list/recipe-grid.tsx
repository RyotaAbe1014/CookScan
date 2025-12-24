import Link from 'next/link'

type Recipe = {
  id: string
  title: string
  imageUrl: string | null
  createdAt: Date
  ingredients: Array<{ id: string }>
  recipeTags: Array<{
    tagId: string
    tag: {
      id: string
      name: string
    }
  }>
}

type RecipeGridProps = {
  recipes: Recipe[]
}

export function RecipeGrid({ recipes }: RecipeGridProps) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {recipes.map((recipe) => (
        <Link key={recipe.id} href={`/recipes/${recipe.id}`} className="group">
          <div className="relative overflow-hidden rounded-xl bg-white shadow-md ring-1 ring-gray-900/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
            {recipe.imageUrl && (
              <div className="relative h-48 overflow-hidden bg-gray-200">
                <img
                  src={recipe.imageUrl}
                  alt={recipe.title}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent" />
              </div>
            )}
            <div className="p-5">
              <h3 className="text-lg font-bold text-gray-900 transition-colors group-hover:text-indigo-600">
                {recipe.title}
              </h3>
              <div className="mt-2 flex items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <svg className="h-4 w-4 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                  <span className="font-medium">{recipe.ingredients.length}</span>
                  <span className="text-gray-500">品目</span>
                </div>
              </div>
              {recipe.recipeTags.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {recipe.recipeTags.slice(0, 3).map((recipeTag) => (
                    <span
                      key={recipeTag.tagId}
                      className="inline-flex items-center gap-1 rounded-md bg-indigo-50 px-2 py-1 text-xs font-medium text-indigo-700 ring-1 ring-indigo-200"
                    >
                      <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                        />
                      </svg>
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
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
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
