import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getRecipeById } from '@/features/recipes/detail/actions'
import RecipeDetailActions from '@/features/recipes/detail/recipe-detail-actions'
import { Header } from '@/components/header'
import { Card, CardHeader, CardContent } from '@/components/ui/card'

type RecipeDetailPageProps = {
  params: Promise<{ id: string }>
}

export default async function RecipeDetailPage({ params }: RecipeDetailPageProps) {
  const { id } = await params
  const { recipe, error } = await getRecipeById(id)

  if (error || !recipe) {
    notFound()
  }

  const memo = recipe.memo || ''
  const sourceInfo = recipe.sourceInfo[0]

  return (
    <div
      id="recipe-detail-capture"
      className="min-h-screen bg-linear-to-br from-indigo-50 via-white to-purple-50"
    >
      <Header
        title={recipe.title}
        subtitle={`作成日: ${recipe.createdAt.toLocaleDateString('ja-JP')}`}
        rightAction={
          <>
            <RecipeDetailActions recipe={recipe} />
            <Link
              href="/recipes"
              className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-600 transition-colors hover:bg-gray-50 hover:text-indigo-600 sm:border-0 sm:bg-transparent sm:px-0 sm:py-0"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span className="hidden sm:inline">マイレシピに戻る</span>
            </Link>
          </>
        }
      />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* 左側: レシピ画像とソース情報 */}
          <div className="lg:col-span-1">
            {/* レシピ画像 */}
            {recipe.imageUrl && (
              <Card className="mb-6">
                <CardContent>
                  <div className="mb-4 flex items-center gap-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-linear-to-br from-indigo-500 to-purple-600 shadow-md">
                      <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">レシピ画像</h3>
                  </div>
                  <img
                    src={recipe.imageUrl}
                    alt={recipe.title}
                    className="w-full rounded-xl object-cover shadow-md"
                  />
                </CardContent>
              </Card>
            )}

            {/* ソース情報 */}
            {sourceInfo && (
              <Card className="mb-6">
                <CardHeader
                  icon={
                    <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  }
                  iconColor="amber"
                  title="ソース情報"
                />
                <CardContent>
                  <div className="space-y-3 text-sm">
                    {sourceInfo.sourceName && (
                      <div className="flex items-start gap-2 rounded-lg bg-linear-to-r from-gray-50 to-white p-3 ring-1 ring-gray-200">
                        <svg className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                        <div>
                          <span className="font-semibold text-gray-900">本の名前</span>
                          <p className="mt-1 text-gray-600">{sourceInfo.sourceName}</p>
                        </div>
                      </div>
                    )}
                    {sourceInfo.pageNumber && (
                      <div className="flex items-start gap-2 rounded-lg bg-linear-to-r from-gray-50 to-white p-3 ring-1 ring-gray-200">
                        <svg className="mt-0.5 h-4 w-4 shrink-0 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        </svg>
                        <div>
                          <span className="font-semibold text-gray-900">ページ番号</span>
                          <p className="mt-1 text-gray-600">{sourceInfo.pageNumber}</p>
                        </div>
                      </div>
                    )}
                    {sourceInfo.sourceUrl && (
                      <div className="flex items-start gap-2 rounded-lg bg-linear-to-r from-gray-50 to-white p-3 ring-1 ring-gray-200">
                        <svg className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                        </svg>
                        <div className="flex-1 overflow-hidden">
                          <span className="font-semibold text-gray-900">参照URL</span>
                          <a
                            href={sourceInfo.sourceUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-1 block truncate text-indigo-600 transition-colors hover:text-indigo-700 hover:underline"
                          >
                            {sourceInfo.sourceUrl}
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* メモ */}
            {memo && (
              <Card className="mb-6">
                <CardHeader
                  icon={
                    <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  }
                  iconColor="purple"
                  title="メモ"
                />
                <CardContent>
                  <p className="whitespace-pre-wrap text-sm leading-relaxed text-gray-600">{memo}</p>
                </CardContent>
              </Card>
            )}

            {/* タグ */}
            {recipe.recipeTags.length > 0 && (() => {
              const tagsByCategory = recipe.recipeTags.reduce((acc: Map<string, { name: string; tags: Array<{ id: string; name: string }> }>, recipeTag: typeof recipe.recipeTags[number]) => {
                const categoryId = recipeTag.tag.category.id
                const categoryName = recipeTag.tag.category.name

                if (!acc.has(categoryId)) {
                  acc.set(categoryId, {
                    name: categoryName,
                    tags: []
                  })
                }

                acc.get(categoryId)!.tags.push(recipeTag.tag)
                return acc
              }, new Map<string, { name: string; tags: Array<{ id: string; name: string }> }>())

              return (
                <Card className="mb-6">
                  <CardHeader
                    icon={
                      <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
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
                            <h4 className="text-sm font-semibold text-gray-900">
                              {category.name}
                            </h4>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {category.tags.map((tag: { id: string; name: string }) => (
                              <span
                                key={tag.id}
                                className="inline-flex items-center gap-1.5 rounded-lg bg-linear-to-r from-indigo-600 to-purple-600 px-3 py-2 text-sm font-medium text-white shadow-lg shadow-indigo-500/30 ring-2 ring-indigo-600"
                              >
                                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
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
            })()}
          </div>

          {/* 右側: 材料と調理手順 */}
          <div className="lg:col-span-2">
            {/* 材料 */}
            <Card className="mb-8">
              <CardHeader
                icon={
                  <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                }
                iconColor="green"
                title="材料"
              />
              <CardContent>
                {recipe.ingredients.length > 0 ? (
                  <div className="space-y-2">
                    {recipe.ingredients.map((ingredient: typeof recipe.ingredients[number]) => (
                      <div key={ingredient.id} className="flex items-center justify-between rounded-lg bg-linear-to-r from-gray-50 to-white p-3 ring-1 ring-gray-200 transition-all hover:shadow-md">
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-2 rounded-full bg-green-500" />
                          <span className="font-semibold text-gray-900">{ingredient.name}</span>
                        </div>
                        <div className="text-right">
                          {ingredient.unit && (
                            <span className="text-sm font-medium text-gray-600">{ingredient.unit}</span>
                          )}
                          {ingredient.notes && (
                            <div className="text-xs text-gray-500">{ingredient.notes}</div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">材料が登録されていません</p>
                )}
              </CardContent>
            </Card>

            {/* 調理手順 */}
            <Card>
              <CardHeader
                icon={
                  <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                  </svg>
                }
                iconColor="blue"
                title="調理手順"
              />
              <CardContent>
                {recipe.steps.length > 0 ? (
                  <div className="space-y-4">
                    {recipe.steps.map((step: typeof recipe.steps[number]) => (
                      <div key={step.id} className="group flex gap-4 rounded-lg bg-linear-to-r from-gray-50 to-white p-4 ring-1 ring-gray-200 transition-all hover:shadow-md">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-linear-to-br from-blue-500 to-indigo-600 text-base font-bold text-white shadow-md">
                          {step.orderIndex}
                        </div>
                        <div className="flex-1">
                          <p className="leading-relaxed text-gray-900">{step.instruction}</p>
                          {step.timerSeconds && (
                            <div className="mt-3 inline-flex items-center gap-2 rounded-lg bg-white px-3 py-2 ring-1 ring-gray-200">
                              <svg className="h-4 w-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              <span className="text-sm font-medium text-gray-700">
                                タイマー: {Math.floor(step.timerSeconds / 60)}分{step.timerSeconds % 60}秒
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">調理手順が登録されていません</p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* アクションボタン */}
        <div className="mt-8 flex justify-center">
          <RecipeDetailActions recipe={recipe} />
        </div>
      </main>
    </div>
  )
}
