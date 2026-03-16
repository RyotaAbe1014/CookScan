import { UserIcon } from "@/components/icons/user-icon";

export function ProfileSetupHeader() {
  return (
    <div className="text-center">
      {/* アイコン - フラットデザイン、emerald-600 */}
      <div className="bg-primary mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl shadow-lg">
        <UserIcon className="h-10 w-10 text-white" />
      </div>

      {/* タイトル - emerald-600 単色 */}
      <h1 className="text-primary text-3xl font-bold">プロフィール設定</h1>

      {/* 説明テキスト - neutral-600 */}
      <p className="text-muted-foreground mt-3 text-sm leading-relaxed">
        CookScanへようこそ！まずはプロフィール情報を設定しましょう
      </p>
    </div>
  );
}
