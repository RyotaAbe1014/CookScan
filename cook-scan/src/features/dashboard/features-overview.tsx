import {
  CameraIcon,
  ListIcon,
  TagIcon,
  SearchIcon,
} from '@/components/icons'

export function FeaturesOverview() {
  return (
    <div className="rounded-xl bg-white p-6 shadow-md sm:p-8">
      <h3 className="mb-6 text-lg font-semibold text-gray-900">CookScanでできること</h3>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600">
            <CameraIcon className="h-5 w-5" />
          </div>
          <div>
            <h4 className="font-medium text-gray-900">AI画像認識</h4>
            <p className="mt-1 text-sm text-gray-600">高精度のOCRでテキストを抽出</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-green-100 text-green-600">
            <ListIcon className="h-5 w-5" />
          </div>
          <div>
            <h4 className="font-medium text-gray-900">自動構造化</h4>
            <p className="mt-1 text-sm text-gray-600">材料と手順を自動で整理</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-100 text-amber-600">
            <TagIcon className="h-5 w-5" />
          </div>
          <div>
            <h4 className="font-medium text-gray-900">タグで整理</h4>
            <p className="mt-1 text-sm text-gray-600">カテゴリ別にレシピを分類</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-purple-100 text-purple-600">
            <SearchIcon className="h-5 w-5" />
          </div>
          <div>
            <h4 className="font-medium text-gray-900">簡単検索</h4>
            <p className="mt-1 text-sm text-gray-600">すぐに見つかるレシピ検索</p>
          </div>
        </div>
      </div>
    </div>
  )
}
