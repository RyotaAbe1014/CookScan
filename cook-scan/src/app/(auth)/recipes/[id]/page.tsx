import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getRecipeById } from '@/features/recipes/detail/actions'
import RecipeDetailActions from '@/features/recipes/detail/recipe-detail-actions'

interface RecipeDetailPageProps {
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
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                {recipe.title}
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                作成日: {recipe.createdAt.toLocaleDateString('ja-JP')}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <RecipeDetailActions recipe={recipe} />
              <Link
                href="/recipes"
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                マイレシピに戻る
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* 左側: レシピ画像とソース情報 */}
          <div className="lg:col-span-1">
            {/* レシピ画像 */}
            {recipe.imageUrl && (
              <div className="mb-6 rounded-lg bg-white p-6 shadow">
                <img
                  src={recipe.imageUrl}
                  alt={recipe.title}
                  className="w-full rounded-lg object-cover"
                />
              </div>
            )}

            {/* ソース情報 */}
            {sourceInfo && (
              <div className="mb-6 rounded-lg bg-white p-6 shadow">
                <h3 className="mb-4 text-lg font-medium text-gray-900">ソース情報</h3>
                <div className="space-y-2 text-sm">
                  {sourceInfo.sourceName && (
                    <div>
                      <span className="font-medium text-gray-700">本の名前:</span>
                      <span className="ml-2 text-gray-600">{sourceInfo.sourceName}</span>
                    </div>
                  )}
                  {sourceInfo.pageNumber && (
                    <div>
                      <span className="font-medium text-gray-700">ページ番号:</span>
                      <span className="ml-2 text-gray-600">{sourceInfo.pageNumber}</span>
                    </div>
                  )}
                  {sourceInfo.sourceUrl && (
                    <div>
                      <span className="font-medium text-gray-700">参照URL:</span>
                      <a
                        href={sourceInfo.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ml-2 text-indigo-600 hover:text-indigo-500"
                      >
                        {sourceInfo.sourceUrl}
                      </a>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* メモ */}
            {memo && (
              <div className="mb-6 rounded-lg bg-white p-6 shadow">
                <h3 className="mb-4 text-lg font-medium text-gray-900">メモ</h3>
                <p className="whitespace-pre-wrap text-sm text-gray-600">{memo}</p>
              </div>
            )}
          </div>

          {/* 右側: 材料と調理手順 */}
          <div className="lg:col-span-2">
            {/* 材料 */}
            <div className="mb-8 rounded-lg bg-white p-6 shadow">
              <h3 className="mb-4 text-lg font-medium text-gray-900">材料</h3>
              {recipe.ingredients.length > 0 ? (
                <div className="space-y-2">
                  {recipe.ingredients.map((ingredient) => (
                    <div key={ingredient.id} className="flex items-center justify-between border-b border-gray-100 py-2 last:border-0">
                      <span className="font-medium text-gray-900">{ingredient.name}</span>
                      <div className="text-right">
                        {ingredient.unit && (
                          <span className="text-sm text-gray-600">{ingredient.unit}</span>
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
            </div>

            {/* 調理手順 */}
            <div className="rounded-lg bg-white p-6 shadow">
              <h3 className="mb-4 text-lg font-medium text-gray-900">調理手順</h3>
              {recipe.steps.length > 0 ? (
                <div className="space-y-4">
                  {recipe.steps.map((step) => (
                    <div key={step.id} className="flex gap-4">
                      <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-indigo-100 text-sm font-medium text-indigo-600">
                        {step.orderIndex}
                      </div>
                      <div className="flex-1">
                        <p className="text-gray-900">{step.instruction}</p>
                        {step.timerSeconds && (
                          <div className="mt-2 flex items-center text-sm text-gray-500">
                            <svg className="mr-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            タイマー: {Math.floor(step.timerSeconds / 60)}分{step.timerSeconds % 60}秒
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">調理手順が登録されていません</p>
              )}
            </div>
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