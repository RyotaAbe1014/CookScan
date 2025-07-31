type Props = {
  onSelect: (method: 'scan' | 'manual') => void
}

export default function MethodSelector({ onSelect }: Props) {
  return (
    <div className="grid gap-6 sm:grid-cols-2">
      <button
        onClick={() => onSelect('scan')}
        className="group relative rounded-lg border-2 border-gray-200 bg-white p-8 text-left hover:border-indigo-500 hover:shadow-lg transition-all"
      >
        <div className="flex flex-col items-center text-center">
          <div className="rounded-full bg-indigo-50 p-4 group-hover:bg-indigo-100 transition-colors">
            <svg
              className="h-12 w-12 text-indigo-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </div>
          <h3 className="mt-4 text-lg font-medium text-gray-900">
            画像からスキャン
          </h3>
          <p className="mt-2 text-sm text-gray-500">
            料理本やレシピカードの写真を撮影して、自動でレシピを抽出します
          </p>
          <div className="mt-4 inline-flex items-center text-sm font-medium text-indigo-600 group-hover:text-indigo-500">
            推奨
            <span className="ml-2 inline-flex items-center rounded-full bg-indigo-100 px-2.5 py-0.5 text-xs font-medium text-indigo-800">
              簡単
            </span>
          </div>
        </div>
      </button>

      <button
        onClick={() => onSelect('manual')}
        className="group relative rounded-lg border-2 border-gray-200 bg-white p-8 text-left hover:border-gray-400 hover:shadow-lg transition-all"
      >
        <div className="flex flex-col items-center text-center">
          <div className="rounded-full bg-gray-50 p-4 group-hover:bg-gray-100 transition-colors">
            <svg
              className="h-12 w-12 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
          </div>
          <h3 className="mt-4 text-lg font-medium text-gray-900">
            手動で入力
          </h3>
          <p className="mt-2 text-sm text-gray-500">
            レシピの詳細を一つずつ入力して、オリジナルレシピを作成します
          </p>
          <div className="mt-4 inline-flex items-center text-sm font-medium text-gray-600">
            詳細な編集が可能
          </div>
        </div>
      </button>
    </div>
  )
}