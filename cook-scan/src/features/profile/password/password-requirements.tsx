/**
 * パスワード要件表示コンポーネント
 */

export const PasswordRequirements = () => {
  return (
    <div className="rounded-lg bg-blue-50 p-4">
      <p className="text-sm font-medium text-blue-900 mb-2">
        パスワードの要件:
      </p>
      <ul className="text-xs text-blue-800 space-y-1">
        <li>• 8文字以上</li>
        <li>• 大文字を1文字以上含む</li>
        <li>• 小文字を1文字以上含む</li>
        <li>• 数字を1文字以上含む</li>
      </ul>
    </div>
  )
}
