import { UserIcon } from '@/components/icons'

export function ProfileSetupHeader() {
  return (
    <div className="text-center">
      <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-linear-to-br from-indigo-500 to-purple-600 shadow-xl shadow-indigo-500/30">
        <UserIcon className="h-10 w-10 text-white" />
      </div>
      <h1 className="text-3xl font-bold bg-linear-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
        プロフィール設定
      </h1>
      <p className="mt-3 text-sm leading-relaxed text-gray-600">
        初めてご利用いただくため、プロフィール情報を設定してください
      </p>
    </div>
  )
}
