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
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <Header title="ダッシュボード" rightAction={<LogoutButton />} />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Welcome Section */}
        <div className="mb-10 overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 p-8 shadow-xl">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
              <svg
                className="h-8 w-8 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-white sm:text-3xl">
                こんにちは、{profile.name}さん
              </h2>
              <p className="mt-1 text-sm text-indigo-100 sm:text-base">
                {profile.email}
              </p>
            </div>
            <div className="hidden sm:block">
              <div className="rounded-lg bg-white/10 px-4 py-2 backdrop-blur-sm">
                <p className="text-xs text-white/80">ダッシュボード</p>
                <p className="text-lg font-bold text-white">CookScan</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h3 className="mb-4 text-lg font-semibold text-gray-900">
            クイックアクション
          </h3>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {/* Scan Recipe Card */}
            <Link
              href="/recipes/upload"
              className="group relative overflow-hidden rounded-xl border border-gray-200 bg-white p-6 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="absolute right-0 top-0 h-32 w-32 translate-x-8 -translate-y-8 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 opacity-50 transition-transform group-hover:scale-110" />
              <div className="relative">
                <div className="mb-4 inline-flex rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 p-3 text-white shadow-lg transition-transform group-hover:scale-110">
                  <svg
                    className="h-7 w-7"
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
                </div>
                <h3 className="mb-2 text-xl font-bold text-gray-900">
                  レシピをスキャン
                </h3>
                <p className="text-sm leading-relaxed text-gray-600">
                  料理本やレシピカードを撮影して、AIが自動でデジタル化します
                </p>
                <div className="mt-4 flex items-center text-sm font-medium text-indigo-600 transition-colors group-hover:text-purple-600">
                  スキャンを開始
                  <svg
                    className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </div>
            </Link>

            {/* My Recipes Card */}
            <Link
              href="/recipes"
              className="group relative overflow-hidden rounded-xl border border-gray-200 bg-white p-6 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="absolute right-0 top-0 h-32 w-32 translate-x-8 -translate-y-8 rounded-full bg-gradient-to-br from-green-100 to-emerald-100 opacity-50 transition-transform group-hover:scale-110" />
              <div className="relative">
                <div className="mb-4 inline-flex rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 p-3 text-white shadow-lg transition-transform group-hover:scale-110">
                  <svg
                    className="h-7 w-7"
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
                <h3 className="mb-2 text-xl font-bold text-gray-900">
                  マイレシピ
                </h3>
                <p className="text-sm leading-relaxed text-gray-600">
                  保存したレシピを閲覧・編集・管理できます
                </p>
                <div className="mt-4 flex items-center text-sm font-medium text-green-600 transition-colors group-hover:text-emerald-600">
                  レシピを見る
                  <svg
                    className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </div>
            </Link>

            {/* Tags Card */}
            <Link
              href="/tags"
              className="group relative overflow-hidden rounded-xl border border-gray-200 bg-white p-6 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="absolute right-0 top-0 h-32 w-32 translate-x-8 -translate-y-8 rounded-full bg-gradient-to-br from-amber-100 to-orange-100 opacity-50 transition-transform group-hover:scale-110" />
              <div className="relative">
                <div className="mb-4 inline-flex rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 p-3 text-white shadow-lg transition-transform group-hover:scale-110">
                  <svg
                    className="h-7 w-7"
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
                <h3 className="mb-2 text-xl font-bold text-gray-900">タグ管理</h3>
                <p className="text-sm leading-relaxed text-gray-600">
                  タグとカテゴリを作成・編集して、レシピを整理しましょう
                </p>
                <div className="mt-4 flex items-center text-sm font-medium text-amber-600 transition-colors group-hover:text-orange-600">
                  タグを管理
                  <svg
                    className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </div>
            </Link>
          </div>
        </div>

        {/* Features Overview */}
        <div className="rounded-xl bg-white p-6 shadow-md sm:p-8">
          <h3 className="mb-6 text-lg font-semibold text-gray-900">
            CookScanでできること
          </h3>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600">
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </div>
              <div>
                <h4 className="font-medium text-gray-900">AI画像認識</h4>
                <p className="mt-1 text-sm text-gray-600">
                  高精度のOCRでテキストを抽出
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-green-100 text-green-600">
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <div>
                <h4 className="font-medium text-gray-900">自動構造化</h4>
                <p className="mt-1 text-sm text-gray-600">
                  材料と手順を自動で整理
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-100 text-amber-600">
                <svg
                  className="h-5 w-5"
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
              <div>
                <h4 className="font-medium text-gray-900">タグで整理</h4>
                <p className="mt-1 text-sm text-gray-600">
                  カテゴリ別にレシピを分類
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-purple-100 text-purple-600">
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <div>
                <h4 className="font-medium text-gray-900">簡単検索</h4>
                <p className="mt-1 text-sm text-gray-600">
                  すぐに見つかるレシピ検索
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
