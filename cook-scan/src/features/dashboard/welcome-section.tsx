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
    <div className="group relative mb-8 overflow-hidden rounded-xl bg-emerald-600 p-8 sm:p-10 lg:p-12 shadow-md transition-all duration-200 hover:shadow-lg">
      {/* 控えめな背景装飾 */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.03]">
        <div className="absolute -right-24 -top-24 h-96 w-96 rounded-full bg-white" />
        <div className="absolute -bottom-24 -left-24 h-80 w-80 rounded-full bg-teal-400" />
      </div>

      <div className="relative flex flex-col gap-8 sm:flex-row sm:items-center sm:justify-between">
        {/* メインコンテンツ */}
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:gap-8">
          {/* アバター */}
          <div className="relative">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-white shadow-md transition-all duration-200 group-hover:scale-105">
              <UserIcon className="h-10 w-10 text-emerald-600" />
            </div>
          </div>

          {/* テキストセクション */}
          <div className="flex-1">
            <h1 className="mb-2 text-3xl font-bold text-white sm:text-4xl">
              こんにちは、{displayName}さん
            </h1>
            <p className="mb-4 text-base text-emerald-50 sm:text-lg">{profile.email}</p>
            <div className="flex items-center gap-3">
              <div className="h-1 w-12 rounded-full bg-white/40" />
              <p className="text-sm font-medium text-white/90">料理を楽しもう</p>
            </div>
          </div>
        </div>

        {/* アクション */}
        <Link
          href="/settings/profile"
          className="group/edit inline-flex w-fit items-center gap-2 rounded-lg bg-white px-6 py-3 text-sm font-semibold text-emerald-600 shadow-md transition-all duration-200 hover:bg-emerald-50 hover:shadow-lg"
        >
          <MemoIcon className="h-4 w-4 transition-transform duration-200 group-hover/edit:rotate-12" />
          プロフィール編集
        </Link>
      </div>
    </div>
  )
}
