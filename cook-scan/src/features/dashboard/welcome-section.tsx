type Profile = {
  name: string
  email: string
}

type WelcomeSectionProps = {
  profile: Profile
}

export function WelcomeSection({ profile }: WelcomeSectionProps) {
  return (
    <div className="mb-10 overflow-hidden rounded-2xl bg-linear-to-r from-indigo-600 to-purple-600 p-8 shadow-xl">
      <div className="flex items-center gap-4">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
          <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
        </div>
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-white sm:text-3xl">こんにちは、{profile.name}さん</h2>
          <p className="mt-1 text-sm text-indigo-100 sm:text-base">{profile.email}</p>
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
