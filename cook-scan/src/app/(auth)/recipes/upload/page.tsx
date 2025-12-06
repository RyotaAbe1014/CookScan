import Link from 'next/link'
import RecipeUploadContent from '@/features/recipes/upload/recipe-upload-content'
import { Header } from '@/components/header'


export default function RecipeUploadPage() {

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <Header
        title="レシピをアップロード"
        subtitle="画像から自動抽出、または手動で入力"
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

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <RecipeUploadContent />
      </main>
    </div>
  )
}
