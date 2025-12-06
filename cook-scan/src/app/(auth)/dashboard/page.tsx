import { checkUserProfile } from '@/features/auth/auth-utils'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import LogoutButton from '@/features/auth/logout-button'
import { Header } from '@/components/header'

export default async function DashboardPage() {
  const { profile } = await checkUserProfile()

  if (!profile) {
    return redirect('/login')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        title="CookScan ダッシュボード"
        rightAction={<LogoutButton />}
      />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900">
            こんにちは、{profile.name}さん
          </h2>
          <p className="mt-1 text-sm text-gray-600">{profile.email}</p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <Link
            href="/recipes/upload"
            className="group relative rounded-lg border border-gray-200 bg-white p-6 hover:shadow-lg transition-shadow"
          >
            <div>
              <span className="inline-flex rounded-lg bg-indigo-50 p-3 text-indigo-600 group-hover:bg-indigo-100">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </span>
            </div>
            <div className="mt-4">
              <h3 className="text-lg font-medium text-gray-900">レシピをスキャン</h3>
              <p className="mt-2 text-sm text-gray-500">
                料理本やレシピカードを撮影して、デジタル化しましょう
              </p>
            </div>
          </Link>

          <Link
            href="/recipes"
            className="group relative rounded-lg border border-gray-200 bg-white p-6 hover:shadow-lg transition-shadow"
          >
            <div>
              <span className="inline-flex rounded-lg bg-green-50 p-3 text-green-600 group-hover:bg-green-100">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </span>
            </div>
            <div className="mt-4">
              <h3 className="text-lg font-medium text-gray-900">マイレシピ</h3>
              <p className="mt-2 text-sm text-gray-500">
                保存したレシピを閲覧・編集・管理できます
              </p>
            </div>
          </Link>

          <Link
            href="/tags"
            className="group relative rounded-lg border border-gray-200 bg-white p-6 hover:shadow-lg transition-shadow"
          >
            <div>
              <span className="inline-flex rounded-lg bg-yellow-50 p-3 text-yellow-600 group-hover:bg-yellow-100">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 7h.01M7 7a2 2 0 012-2h6l6 6-8 8-6-6V7zm0 0H5a2 2 0 00-2 2v2a2 2 0 00.586 1.414l6 6"
                  />
                </svg>
              </span>
            </div>
            <div className="mt-4">
              <h3 className="text-lg font-medium text-gray-900">タグ一覧</h3>
              <p className="mt-2 text-sm text-gray-500">
                作成済みのタグカテゴリとタグを確認できます
              </p>
            </div>
          </Link>
        </div>
      </main>
    </div>
  )
}
