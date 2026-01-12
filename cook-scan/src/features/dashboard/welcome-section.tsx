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
    <div className="mb-8">
      <h2 className="text-2xl font-bold text-neutral-900 sm:text-3xl">
        こんにちは、{displayName}さん
      </h2>
      <p className="mt-1 text-slate-600">今日は何を料理しますか？</p>
    </div>
  )
}
