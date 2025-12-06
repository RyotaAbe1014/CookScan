import { checkUserProfile } from '@/features/auth/auth-utils'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { TagFilter } from '@/features/recipes/list/tag-filter'
import { Suspense } from 'react'
import { Header } from '@/components/header'

type SearchParams = Promise<{ tag?: string | string[] }>

export default async function RecipesPage({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  const { profile } = await checkUserProfile()
  const params = await searchParams

  // Get selected tag IDs from URL
  const selectedTagIds = params.tag
    ? Array.isArray(params.tag)
      ? params.tag
      : [params.tag]
    : []

  // Build where clause for recipe filtering
  const tagFilters = selectedTagIds.length > 0
    ? selectedTagIds.map(tagId => ({
        recipeTags: {
          some: {
            tagId: tagId,
          },
        },
      }))
    : undefined

  // Fetch recipes and tag categories in parallel
  const [recipes, tagCategories] = await Promise.all([
    prisma.recipe.findMany({
      where: {
        userId: profile?.id as string,
        ...(tagFilters && { AND: tagFilters }),
      },
      include: {
        ingredients: true,
        recipeTags: {
          include: {
            tag: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    }),
    prisma.tagCategory.findMany({
      where: {
        OR: [
          { isSystem: true },
          { userId: profile?.id as string }
        ]
      },
      include: {
        tags: {
          orderBy: { name: 'asc' }
        }
      },
      orderBy: { createdAt: 'asc' }
    })
  ])

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <Header
        title="マイレシピ"
        subtitle="保存済みのレシピ一覧"
        rightAction={
          <Link
            href="/dashboard"
            className="flex items-center gap-1.5 text-sm text-gray-600 transition-colors hover:text-indigo-600"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            ダッシュボード
          </Link>
        }
      />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Stats Bar */}
        <div className="mb-6 flex items-center justify-between rounded-xl bg-white p-4 shadow-md">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-green-500 to-emerald-600">
              <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-gray-600">保存レシピ数</p>
              <p className="text-2xl font-bold text-gray-900">{recipes.length}</p>
            </div>
          </div>
          <Link
            href="/recipes/upload"
            className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 transition-all hover:shadow-xl hover:shadow-indigo-500/40"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            レシピをスキャン
          </Link>
        </div>

        <Suspense fallback={null}>
          <TagFilter tagCategories={tagCategories} />
        </Suspense>

        {recipes.length === 0 ? (
          <div className="rounded-xl bg-white p-12 text-center shadow-lg">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-gray-100 to-gray-200">
              <svg
                className="h-10 w-10 text-gray-400"
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
            </div>
            {selectedTagIds.length > 0 ? (
              <>
                <h3 className="mt-6 text-lg font-semibold text-gray-900">
                  該当するレシピがありません
                </h3>
                <p className="mt-2 text-sm text-gray-600">
                  選択したタグに一致するレシピが見つかりませんでした
                </p>
                <div className="mt-6">
                  <Link
                    href="/recipes"
                    className="inline-flex items-center gap-2 rounded-lg border-2 border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm transition-all hover:border-indigo-300 hover:bg-indigo-50"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    フィルターをクリア
                  </Link>
                </div>
              </>
            ) : (
              <>
                <h3 className="mt-6 text-lg font-semibold text-gray-900">
                  レシピがまだありません
                </h3>
                <p className="mt-2 text-sm text-gray-600">
                  レシピをスキャンして、マイレシピに追加しましょう
                </p>
                <div className="mt-6">
                  <Link
                    href="/recipes/upload"
                    className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 transition-all hover:shadow-xl hover:shadow-indigo-500/40"
                  >
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    レシピをスキャン
                  </Link>
                </div>
              </>
            )}
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {recipes.map((recipe) => (
              <Link
                key={recipe.id}
                href={`/recipes/${recipe.id}`}
                className="group"
              >
                <div className="relative overflow-hidden rounded-xl bg-white shadow-md ring-1 ring-gray-900/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                  {recipe.imageUrl && (
                    <div className="relative h-48 overflow-hidden bg-gray-200">
                      <img
                        src={recipe.imageUrl}
                        alt={recipe.title}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                    </div>
                  )}
                  <div className="p-5">
                    <h3 className="text-lg font-bold text-gray-900 transition-colors group-hover:text-indigo-600">
                      {recipe.title}
                    </h3>
                    <div className="mt-2 flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <svg className="h-4 w-4 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
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
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
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
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {new Date(recipe.createdAt).toLocaleDateString('ja-JP', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
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
