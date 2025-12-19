import { checkUserProfile } from '@/features/auth/auth-utils'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { TagCreateForm } from '@/features/tags/tag-create-form'
import { CategoryItem } from '@/features/tags/category-item'
import { Header } from '@/components/header'

export default async function TagsPage() {
  const { profile } = await checkUserProfile()

  const userId = profile?.id

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
          recipeTags: userId
            ? {
                where: {
                  recipe: {
                    userId
                  }
                },
                select: { recipeId: true }
              }
            : {
                select: { recipeId: true }
              }
        }
      }
    },
    orderBy: { createdAt: 'asc' }
  })

  return (
    <div className="min-h-screen bg-linear-to-br from-indigo-50 via-white to-purple-50">
      <Header
        title="タグ管理"
        subtitle="レシピを整理・分類するタグを管理"
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

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
        {/* Info Banner */}
        <div className="overflow-hidden rounded-xl bg-linear-to-r from-amber-500 to-orange-600 p-6 shadow-lg">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-white/20 backdrop-blur-sm">
              <svg
                className="h-6 w-6 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-white">タグでレシピを整理</h3>
              <p className="mt-1 text-sm text-orange-100">
                カテゴリとタグを使ってレシピを分類し、簡単に見つけられるようにしましょう
              </p>
            </div>
          </div>
        </div>

        {/* タグ作成フォーム */}
        <TagCreateForm categories={tagCategories} />

        {/* タグ一覧セクション */}
        <div>
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">登録済みのタグ</h2>
              <p className="mt-1 text-sm text-gray-600">
                カテゴリごとに整理されたタグ一覧
              </p>
            </div>
            {tagCategories.length > 0 && (
              <div className="flex items-center gap-2 rounded-lg bg-white px-4 py-2 shadow-sm">
                <svg
                  className="h-5 w-5 text-indigo-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                  />
                </svg>
                <span className="text-sm font-medium text-gray-900">
                  {tagCategories.length} カテゴリ
                </span>
              </div>
            )}
          </div>

          {tagCategories.length === 0 ? (
            <div className="overflow-hidden rounded-xl bg-white p-12 text-center shadow-lg">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-linear-to-br from-gray-100 to-gray-200">
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
                    d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                  />
                </svg>
              </div>
              <h3 className="mt-6 text-lg font-semibold text-gray-900">
                タグがまだありません
              </h3>
              <p className="mt-2 text-sm text-gray-600">
                上のフォームからタグとカテゴリを作成して、レシピを整理しましょう
              </p>
              <div className="mt-6 flex justify-center gap-2">
                <div className="flex items-center gap-2 rounded-lg bg-indigo-50 px-4 py-2 text-sm text-indigo-700">
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                      clipRule="evenodd"
                    />
                  </svg>
                  カテゴリを作成してからタグを追加
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {tagCategories.map((category: typeof tagCategories[number]) => (
                <CategoryItem
                  key={category.id}
                  category={category}
                  currentUserId={profile?.id || ''}
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
