import { createClient } from '@/utils/supabase/server'
import { checkUserProfile } from '@/lib/auth-utils'
import Link from 'next/link'
import { logout } from '@/actions/auth'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const { profile } = await checkUserProfile()

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              CookScan ダッシュボード
            </h1>
            <form action={logout}>
              <button className="text-sm text-gray-500 hover:text-gray-700">
                ログアウト
              </button>
            </form>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900">
            こんにちは、{profile?.name}さん
          </h2>
          <p className="mt-1 text-sm text-gray-600">{user?.email}</p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <Link
            href="/recipes/scan"
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
            href="/recipes/search"
            className="group relative rounded-lg border border-gray-200 bg-white p-6 hover:shadow-lg transition-shadow"
          >
            <div>
              <span className="inline-flex rounded-lg bg-purple-50 p-3 text-purple-600 group-hover:bg-purple-100">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </span>
            </div>
            <div className="mt-4">
              <h3 className="text-lg font-medium text-gray-900">レシピを検索</h3>
              <p className="mt-2 text-sm text-gray-500">
                材料やタグでレシピを簡単に見つけられます
              </p>
            </div>
          </Link>
        </div>

        <div className="mt-8 rounded-lg bg-white p-6 shadow">
          <h3 className="text-lg font-medium text-gray-900">最近のアクティビティ</h3>
          <p className="mt-2 text-sm text-gray-500">
            まだレシピがありません。上のボタンから最初のレシピをスキャンしてみましょう！
          </p>
        </div>
      </main>
    </div>
  )
}