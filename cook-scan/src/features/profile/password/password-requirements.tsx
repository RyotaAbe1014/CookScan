/**
 * パスワード要件表示コンポーネント
 */

export const PasswordRequirements = () => {
  return (
    <div className="rounded-md bg-emerald-50 p-3">
      <p className="text-xs text-emerald-700">
        <strong>セキュリティ要件:</strong> パスワードは8文字以上で、大文字、小文字、数字を含める必要があります
      </p>
    </div>
  )
}
