import {
  CameraIcon,
  ListIcon,
  TagIcon,
  SearchIcon,
} from '@/components/icons'

export function FeaturesOverview() {
  const features = [
    {
      icon: CameraIcon,
      title: 'AI画像認識',
      description: '高精度のOCRでテキストを抽出',
      bgColor: 'bg-emerald-100',
      iconColor: 'text-emerald-600',
      accentColor: 'bg-emerald-600',
    },
    {
      icon: ListIcon,
      title: '自動構造化',
      description: '材料と手順を自動で整理',
      bgColor: 'bg-teal-100',
      iconColor: 'text-teal-600',
      accentColor: 'bg-teal-600',
    },
    {
      icon: TagIcon,
      title: 'タグで整理',
      description: 'カテゴリ別にレシピを分類',
      bgColor: 'bg-amber-100',
      iconColor: 'text-amber-600',
      accentColor: 'bg-amber-600',
    },
    {
      icon: SearchIcon,
      title: '簡単検索',
      description: 'すぐに見つかるレシピ検索',
      bgColor: 'bg-sky-100',
      iconColor: 'text-sky-600',
      accentColor: 'bg-sky-600',
    },
  ]

  return (
    <div className="rounded-xl bg-white p-8 shadow-md border border-slate-200 sm:p-10">
      <div className="mb-8 flex items-center gap-3">
        <div className="h-1 w-12 rounded-full bg-emerald-600" />
        <h2 className="text-2xl font-bold text-neutral-900">CookScanでできること</h2>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {features.map((feature, index) => (
          <div
            key={feature.title}
            className="group relative"
            style={{
              animation: 'fadeIn 0.4s ease-out',
              animationDelay: `${index * 80}ms`,
              animationFillMode: 'both',
            }}
          >
            {/* アクセントライン */}
            <div className={`absolute -left-2 top-0 h-full w-0.5 origin-top scale-y-0 rounded-full ${feature.accentColor} transition-transform duration-200 group-hover:scale-y-100`} />

            <div className="flex flex-col items-start gap-4 pl-2">
              {/* アイコン */}
              <div className="relative">
                <div
                  className={`flex h-14 w-14 items-center justify-center rounded-lg ${feature.bgColor} transition-all duration-200 group-hover:scale-105`}
                >
                  <feature.icon className={`h-7 w-7 ${feature.iconColor}`} strokeWidth={2} />
                </div>
              </div>

              {/* テキストコンテンツ */}
              <div>
                <h3 className="mb-2 text-lg font-semibold text-neutral-900 transition-colors duration-200">
                  {feature.title}
                </h3>
                <p className="text-sm leading-relaxed text-slate-600">{feature.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ボトムセクション */}
      <div className="mt-8 rounded-lg bg-emerald-50 p-6 border border-emerald-100">
        <p className="text-center text-sm font-medium text-slate-700">
          <span className="font-semibold text-emerald-600">AI技術</span>を活用して、あなたの料理体験をもっと便利に
        </p>
      </div>
    </div>
  )
}
