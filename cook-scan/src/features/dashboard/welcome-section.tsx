import Link from 'next/link'
import { UserIcon, MemoIcon } from '@/components/icons'

type Profile = {
  name: string | null
  email: string
}

type WelcomeSectionProps = {
  profile: Profile
}

export function WelcomeSection({ profile }: WelcomeSectionProps) {
  const displayName = profile.name || 'ゲスト'

  return (
    <div className="mb-10 overflow-hidden rounded-2xl bg-linear-to-r from-indigo-600 to-purple-600 p-4 sm:p-6 lg:p-8 shadow-xl">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
        <div className="flex h-12 w-12 sm:h-16 sm:w-16 shrink-0 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
          <UserIcon className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
        </div>
        <div className="flex-1">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
            <h2 className="text-xl font-bold text-white sm:text-2xl lg:text-3xl">こんにちは、{displayName}さん</h2>
            <Link
              href="/settings/profile"
              className="flex items-center gap-1 self-start rounded-lg bg-white/20 px-3 py-1 text-sm font-medium text-white transition-colors hover:bg-white/30"
            >
              <MemoIcon className="h-4 w-4" />
              編集
            </Link>
          </div>
          <p className="mt-1 text-sm text-indigo-100 sm:text-base truncate">{profile.email}</p>
        </div>
        <div className="hidden sm:block">
          <div className="rounded-lg bg-white/10 px-4 py-2 backdrop-blur-sm">
            <p className="text-xs text-white/80">ダッシュボード</p>
            <p className="text-lg font-bold text-white">CookScan</p>
          </div>
        </div>
      </div>
    </div>
  )
}
