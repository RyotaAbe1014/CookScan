import { UserIcon } from '@/components/icons/user-icon'

export function ProfileSetupHeader() {
  return (
    <div className="text-center">
      {/* アイコン - フラットデザイン、emerald-600 */}
      <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-emerald-600 shadow-lg">
        <UserIcon className="h-10 w-10 text-white" />
      </div>

      {/* タイトル - emerald-600 単色 */}
      <h1 className="text-3xl font-bold text-emerald-600">
        プロフィール設定
      </h1>

      {/* 説明テキスト - neutral-600 */}
      <p className="mt-3 text-sm leading-relaxed text-neutral-600">
        CookScanへようこそ！まずはプロフィール情報を設定しましょう
      </p>
    </div>
  )
}
