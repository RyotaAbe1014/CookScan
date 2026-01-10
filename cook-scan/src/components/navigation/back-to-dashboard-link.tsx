import Link from 'next/link'
import { ChevronLeftIcon } from '@/components/icons'

export function BackToDashboardLink() {
  return (
    <Link
      href="/dashboard"
      className="flex items-center gap-1.5 text-sm text-gray-600 transition-colors hover:text-indigo-600"
    >
      <ChevronLeftIcon className="h-4 w-4" />
      ダッシュボード
    </Link>
  )
}
