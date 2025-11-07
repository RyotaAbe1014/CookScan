import { checkUserProfile } from '@/features/auth/auth-utils'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'

export default async function TagsPage() {
  const { profile } = await checkUserProfile()

  // Server Componentで直接データ取得
  const tagCategories = await prisma.tagCategory.findMany({
    where: {
      OR: [
        { isSystem: true },
        { userId: profile?.id }
      ]
    },
    include: {
      tags: {
        include: {
          _count: {
            select: { recipeTags: true }
          }
        },
        orderBy: { name: 'asc' }
      }
    },
    orderBy: { createdAt: 'asc' }
  })

  // カテゴリごとのタグ総数を計算
  const totalTags = tagCategories.reduce(
    (sum, category) => sum + category.tags.length,
    0
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ヘッダー */}
      <header className="bg-white shadow">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                タグ一覧
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                登録されているタグとその使用状況
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

      {/* メインコンテンツ */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {totalTags === 0 ? (
          // 空状態
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
                d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              タグがありません
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              レシピを作成すると、タグが自動的に追加されます
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
          // タグカテゴリ一覧
          <div className="space-y-8">
            {tagCategories.map((category) => (
              <div key={category.id} className="bg-white shadow rounded-lg">
                {/* カテゴリヘッダー */}
                <div className="border-b border-gray-200 bg-gray-50 px-6 py-4 rounded-t-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-lg font-medium text-gray-900">
                        {category.name}
                        {category.isSystem && (
                          <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                            システム
                          </span>
                        )}
                      </h2>
                      {category.description && (
                        <p className="mt-1 text-sm text-gray-500">
                          {category.description}
                        </p>
                      )}
                    </div>
                    <span className="text-sm text-gray-500">
                      {category.tags.length}個のタグ
                    </span>
                  </div>
                </div>

                {/* タグ一覧 */}
                <div className="px-6 py-4">
                  {category.tags.length === 0 ? (
                    <p className="text-sm text-gray-500 italic">
                      このカテゴリにはタグがありません
                    </p>
                  ) : (
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                      {category.tags.map((tag) => (
                        <div
                          key={tag.id}
                          className="flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 transition-colors"
                        >
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2">
                              <span className="text-sm font-medium text-gray-900 truncate">
                                {tag.name}
                              </span>
                              {tag.isSystem && (
                                <svg
                                  className="h-4 w-4 text-blue-500 flex-shrink-0"
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              )}
                            </div>
                            {tag.description && (
                              <p className="mt-0.5 text-xs text-gray-500 truncate">
                                {tag.description}
                              </p>
                            )}
                          </div>
                          <div className="ml-3 flex-shrink-0">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                              {tag._count.recipeTags}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* フッター */}
        {totalTags > 0 && (
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500">
              合計 {totalTags} 個のタグ（{tagCategories.length} カテゴリ）
            </p>
          </div>
        )}
      </main>
    </div>
  )
}
