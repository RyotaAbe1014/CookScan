type Props = {
  onSelect: (method: 'scan' | 'manual' | 'text-input') => void
}

export default function MethodSelector({ onSelect }: Props) {
  return (
    <div className="grid gap-6 sm:grid-cols-2">
      <button
        onClick={() => onSelect('scan')}
        className="group relative overflow-hidden rounded-xl bg-white p-8 text-left shadow-lg ring-1 ring-gray-900/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
      >
        <div className="absolute right-0 top-0 h-32 w-32 translate-x-8 -translate-y-8 rounded-full bg-linear-to-br from-indigo-100 to-purple-100 opacity-50 transition-transform group-hover:scale-110" />
        <div className="relative flex flex-col items-center text-center">
          <div className="rounded-xl bg-linear-to-br from-indigo-500 to-purple-600 p-4 shadow-lg transition-transform group-hover:scale-110">
            <svg
              className="h-12 w-12 text-white"
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
          <h3 className="mt-4 text-xl font-bold text-gray-900">
            画像からスキャン
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-gray-600">
            料理本やレシピカードの写真を撮影して、自動でレシピを抽出します
          </p>
          <div className="mt-4 flex items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-lg bg-linear-to-r from-indigo-600 to-purple-600 px-3 py-1.5 text-xs font-semibold text-white shadow-md shadow-indigo-500/30">
              <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              推奨
            </span>
            <span className="inline-flex items-center rounded-lg bg-indigo-50 px-3 py-1.5 text-xs font-medium text-indigo-700 ring-1 ring-indigo-200">
              簡単
            </span>
          </div>
        </div>
      </button>

      <button
        onClick={() => onSelect('text-input')}
        className="group relative overflow-hidden rounded-xl bg-white p-8 text-left shadow-lg ring-1 ring-gray-900/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
        >
        <div className="absolute right-0 top-0 h-32 w-32 translate-x-8 -translate-y-8 rounded-full bg-linear-to-br from-emerald-100 to-teal-100 opacity-50 transition-transform group-hover:scale-110" />
        <div className="relative flex flex-col items-center text-center">
          <div className="rounded-xl bg-linear-to-br from-emerald-500 to-teal-600 p-4 shadow-lg transition-transform group-hover:scale-110">
            <svg
              className="h-12 w-12 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
              />
            </svg>
          </div>
          <h3 className="mt-4 text-xl font-bold text-gray-900">
            テキストからレシピを生成
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-gray-600">
            テキストを入力することで、レシピを生成します
          </p>
          <div className="mt-4 flex items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-lg bg-linear-to-r from-emerald-600 to-teal-600 px-3 py-1.5 text-xs font-semibold text-white shadow-md shadow-emerald-500/30">
              <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              推奨
            </span>
            <span className="inline-flex items-center rounded-lg bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-700 ring-1 ring-emerald-200">
              簡単
            </span>
          </div>
        </div>
      </button>

      <button
        onClick={() => onSelect('manual')}
        className="group relative overflow-hidden rounded-xl bg-white p-8 text-left shadow-lg ring-1 ring-gray-900/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
      >
        <div className="absolute right-0 top-0 h-32 w-32 translate-x-8 -translate-y-8 rounded-full bg-linear-to-br from-gray-100 to-slate-100 opacity-50 transition-transform group-hover:scale-110" />
        <div className="relative flex flex-col items-center text-center">
          <div className="rounded-xl bg-linear-to-br from-gray-500 to-slate-600 p-4 shadow-lg transition-transform group-hover:scale-110">
            <svg
              className="h-12 w-12 text-white"
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
          <h3 className="mt-4 text-xl font-bold text-gray-900">
            手動で入力
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-gray-600">
            レシピの詳細を一つずつ入力して、オリジナルレシピを作成します
          </p>
          <div className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-gray-700">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            詳細な編集が可能
          </div>
        </div>
      </button>
    </div>
  )
}
