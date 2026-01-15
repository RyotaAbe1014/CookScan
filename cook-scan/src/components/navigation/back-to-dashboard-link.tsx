import Link from 'next/link'
import { ChevronLeftIcon } from '@/components/icons/chevron-left-icon'

export function BackToDashboardLink() {
  return (
    <Link
      href="/dashboard"
      className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition-all duration-150 hover:text-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:ring-offset-2 rounded-md"
    >
      <ChevronLeftIcon className="h-4 w-4" />
      ダッシュボード
    </Link>
  )
}
