import { TagIcon, InfoSolidIcon } from '@/components/icons'

export function TagEmptyState() {
  return (
    <div className="overflow-hidden rounded-xl bg-white p-12 text-center shadow-lg">
      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-linear-to-br from-gray-100 to-gray-200">
        <TagIcon className="h-10 w-10 text-gray-400" />
      </div>
      <h3 className="mt-6 text-lg font-semibold text-gray-900">タグがまだありません</h3>
      <p className="mt-2 text-sm text-gray-600">
        上のフォームからタグとカテゴリを作成して、レシピを整理しましょう
      </p>
      <div className="mt-6 flex justify-center gap-2">
        <div className="flex items-center gap-2 rounded-lg bg-indigo-50 px-4 py-2 text-sm text-indigo-700">
          <InfoSolidIcon className="h-4 w-4" />
          カテゴリを作成してからタグを追加
        </div>
      </div>
    </div>
  )
}
