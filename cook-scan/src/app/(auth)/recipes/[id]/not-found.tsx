import Link from 'next/link'
import { Header } from '@/components/layouts/header'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        title="レシピが見つかりません"
        rightAction={
          <Link
            href="/recipes"
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            マイレシピに戻る
          </Link>
        }
      />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
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
              d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6 4h6m-7-8V7a3 3 0 016 0v1M5 12a7 7 0 1114 0v5a2 2 0 01-2 2H7a2 2 0 01-2-2v-5z"
            />
          </svg>
          <h2 className="mt-2 text-lg font-medium text-gray-900">
            お探しのレシピが見つかりませんでした
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            レシピが削除されているか、アクセス権限がない可能性があります
          </p>
          <div className="mt-6">
            <Link
              href="/recipes"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              マイレシピに戻る
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}