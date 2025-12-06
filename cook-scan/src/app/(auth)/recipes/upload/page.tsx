import Link from 'next/link'
import RecipeUploadContent from '@/features/recipes/upload/recipe-upload-content'
import { Header } from '@/components/header'


export default function RecipeUploadPage() {

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        title="レシピをアップロード"
        rightAction={
          <Link
            href="/dashboard"
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            ダッシュボードに戻る
          </Link>
        }
      />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <RecipeUploadContent />
      </main>
    </div>
  )
}
