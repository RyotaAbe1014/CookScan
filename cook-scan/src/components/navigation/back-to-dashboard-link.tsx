import Link from 'next/link'

export function BackToDashboardLink() {
  return (
    <Link
      href="/dashboard"
      className="flex items-center gap-1.5 text-sm text-gray-600 transition-colors hover:text-indigo-600"
    >
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
      </svg>
      ダッシュボード
    </Link>
  )
}
