import Link from 'next/link'
import {
  PlusIcon,
  ChevronRightIcon,
  EmptyIcon,
  TagIcon,
} from '@/components/icons'

export function QuickActions() {
  const actions = [
    {
      href: '/recipes/upload',
      icon: PlusIcon,
      title: 'レシピをスキャン',
      description: '料理本やレシピカードを撮影して、AIが自動でデジタル化します',
      action: 'スキャンを開始',
      bgColor: 'bg-emerald-100',
      iconColor: 'text-emerald-600',
      accentColor: 'bg-emerald-600',
      borderColor: 'border-emerald-200',
      hoverBorderColor: 'hover:border-emerald-300',
    },
    {
      href: '/recipes',
      icon: EmptyIcon,
      title: 'マイレシピ',
      description: '保存したレシピを閲覧・編集して、お気に入りのレシピを管理できます',
      action: 'レシピを見る',
      bgColor: 'bg-teal-100',
      iconColor: 'text-teal-600',
      accentColor: 'bg-teal-600',
      borderColor: 'border-teal-200',
      hoverBorderColor: 'hover:border-teal-300',
    },
    {
      href: '/tags',
      icon: TagIcon,
      title: 'タグ管理',
      description: 'タグとカテゴリを作成・編集して、レシピを整理しましょう',
      action: 'タグを管理',
      bgColor: 'bg-amber-100',
      iconColor: 'text-amber-600',
      accentColor: 'bg-amber-600',
      borderColor: 'border-amber-200',
      hoverBorderColor: 'hover:border-amber-300',
    },
  ]

  return (
    <div className="mb-8">
      <div className="mb-6 flex items-center gap-3">
        <div className="h-1 w-12 rounded-full bg-emerald-600" />
        <h2 className="text-2xl font-bold text-neutral-900">クイックアクション</h2>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {actions.map((action, index) => (
          <Link
            key={action.href}
            href={action.href}
            className={`group relative overflow-hidden rounded-xl bg-white p-6 shadow-md border ${action.borderColor} transition-all duration-200 hover:-translate-y-1 hover:shadow-lg ${action.hoverBorderColor}`}
            style={{
              animation: 'fadeIn 0.4s ease-out',
              animationDelay: `${index * 80}ms`,
              animationFillMode: 'both',
            }}
          >
            <div className="relative flex h-full min-h-[200px] flex-col">
              {/* アイコン */}
              <div className="mb-4 inline-flex">
                <div
                  className={`flex h-14 w-14 items-center justify-center rounded-lg ${action.bgColor} transition-all duration-200 group-hover:scale-105`}
                >
                  <action.icon className={`h-7 w-7 ${action.iconColor}`} strokeWidth={2.5} />
                </div>
              </div>

              {/* コンテンツ */}
              <div className="flex-1">
                <h3 className="mb-2 text-xl font-semibold text-neutral-900">{action.title}</h3>
                <p className="text-sm leading-relaxed text-slate-600">{action.description}</p>
              </div>

              {/* アクションリンク */}
              <div
                className={`mt-4 flex items-center gap-2 text-sm font-semibold ${action.iconColor} transition-all duration-200`}
              >
                <span>{action.action}</span>
                <ChevronRightIcon
                  className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
                  strokeWidth={2.5}
                />
              </div>

              {/* ボトムアクセント */}
              <div className={`absolute bottom-0 left-0 right-0 h-1 origin-left scale-x-0 rounded-full ${action.accentColor} transition-transform duration-200 group-hover:scale-x-100`} />
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
