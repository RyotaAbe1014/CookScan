import Link from 'next/link'
import { ChevronLeftIcon } from '@/components/icons'

export function BackToRecipesLink() {
  return (
    <Link
      href="/recipes"
      className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-600 transition-colors hover:bg-gray-50 hover:text-indigo-600 sm:border-0 sm:bg-transparent sm:px-0 sm:py-0"
    >
      <ChevronLeftIcon className="h-4 w-4" />
      <span className="hidden sm:inline">マイレシピに戻る</span>
    </Link>
  )
}
