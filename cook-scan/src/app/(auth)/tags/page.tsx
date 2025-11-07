import { checkUserProfile } from '@/features/auth/auth-utils'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'

export default async function TagsPage() {
  const { profile } = await checkUserProfile()

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
        }
      }
    },
    orderBy: { createdAt: 'asc' }
  })

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-6 sm:px-6 lg:px-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              タグ一覧
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              レシピ整理に使えるタグを確認できます
            </p>
          </div>
          <Link href="/dashboard" className="text-sm text-gray-500 hover:text-gray-700">
            ダッシュボードに戻る
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {tagCategories.length === 0 ? (
          <div className="rounded-lg bg-white p-8 text-center shadow">
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
                d="M9.75 17L3 10.5l2.25-2.25L9.75 12l9-9L21 5.25 9.75 17z"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              利用可能なタグがありません
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              タグを作成してレシピに分類を追加しましょう
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {tagCategories.map((category) => (
              <div key={category.id} className="overflow-hidden rounded-lg bg-white shadow">
                <div className="border-b border-gray-200 bg-white px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900">
                        {category.name}
                      </h2>
                      <p className="mt-1 text-sm text-gray-500">
                        {category.isSystem ? 'システム提供のタグカテゴリです' : 'あなたが作成したタグカテゴリです'}
                      </p>
                    </div>
                    <span className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-800">
                      タグ {category.tags.length} 件
                    </span>
                  </div>
                </div>
                <div className="px-6 py-4">
                  {category.tags.length === 0 ? (
                    <p className="text-sm text-gray-500">
                      このカテゴリにはまだタグがありません。
                    </p>
                  ) : (
                    <div className="flex flex-wrap gap-3">
                      {category.tags.map((tag) => (
                        <span
                          key={tag.id}
                          className="inline-flex items-center gap-2 rounded-full bg-indigo-50 px-4 py-2 text-sm font-medium text-indigo-700"
                        >
                          <span>{tag.name}</span>
                          <span className="rounded-full bg-white px-2 py-0.5 text-xs font-semibold text-indigo-600">
                            {tag._count.recipeTags} 件のレシピ
                          </span>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
