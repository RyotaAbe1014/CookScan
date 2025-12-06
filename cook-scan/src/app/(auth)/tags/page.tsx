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
    <div className="min-h-screen bg-gray-50">
      <Header
        title="タグ一覧"
        subtitle="レシピ整理に使えるタグを確認・作成できます"
        rightAction={
          <Link href="/dashboard" className="text-sm text-gray-500 hover:text-gray-700">
            ダッシュボードに戻る
          </Link>
        }
      />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
        {/* タグ作成フォーム */}
        <TagCreateForm categories={tagCategories} />

        {/* タグ一覧セクション */}
        <div>
          <h2 className="mb-4 text-xl font-semibold text-gray-900">登録済みのタグ</h2>
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
