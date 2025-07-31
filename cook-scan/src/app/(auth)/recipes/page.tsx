import { checkUserProfile } from '@/lib/auth-utils'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'

export default async function RecipesPage() {
  const { profile } = await checkUserProfile()

  const recipes = await prisma.recipe.findMany({
    where: { userId: profile?.id as string },
    include: {
      ingredients: true,
      recipeTags: {
        include: {
          tag: true
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  })

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                マイレシピ
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                保存済みのレシピ一覧
              </p>
            </div>
            <Link
              href="/dashboard"
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              ダッシュボードに戻る
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {recipes.length === 0 ? (
          <div className="text-center py-12">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              レシピがありません
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              レシピをスキャンして、マイレシピに追加しましょう
            </p>
            <div className="mt-6">
              <Link
                href="/recipes/upload"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <svg
                  className="-ml-1 mr-2 h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                レシピをスキャン
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {recipes.map((recipe) => (
              <Link
                key={recipe.id}
                href={`/recipes/${recipe.id}`}
                className="group"
              >
                <div className="relative overflow-hidden rounded-lg bg-white shadow hover:shadow-lg transition-shadow">
                  {recipe.imageUrl && (
                    <div className="aspect-w-16 aspect-h-9 bg-gray-200">
                      <img
                        src={recipe.imageUrl}
                        alt={recipe.title}
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div className="p-4">
                    <h3 className="text-lg font-medium text-gray-900 group-hover:text-indigo-600">
                      {recipe.title}
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      材料: {recipe.ingredients.length}品目
                    </p>
                    {recipe.recipeTags.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {recipe.recipeTags.slice(0, 3).map((recipeTag) => (
                          <span
                            key={recipeTag.tagId}
                            className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800"
                          >
                            {recipeTag.tag.name}
                          </span>
                        ))}
                        {recipe.recipeTags.length > 3 && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                            +{recipe.recipeTags.length - 3}
                          </span>
                        )}
                      </div>
                    )}
                    <div className="mt-3 text-xs text-gray-500">
                      {new Date(recipe.createdAt).toLocaleDateString('ja-JP')}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}