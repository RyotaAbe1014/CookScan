import Link from 'next/link'
import { ChevronLeftIcon } from '@/components/icons/chevron-left-icon'

export function BackToRecipesLink() {
  return (
    <Link
      href="/recipes"
      className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-500 shadow-sm transition-all duration-150 hover:border-emerald-600 hover:bg-emerald-50 hover:text-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:ring-offset-2 sm:border-0 sm:bg-transparent sm:px-0 sm:py-0 sm:shadow-none sm:hover:bg-transparent sm:hover:border-0"
    >
      <ChevronLeftIcon className="h-4 w-4" />
      <span className="hidden sm:inline">マイレシピに戻る</span>
    </Link>
  )
}
