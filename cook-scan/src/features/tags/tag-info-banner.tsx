import { TagIcon } from '@/components/icons/tag-icon'

export function TagInfoBanner() {
  return (
    <div className="overflow-hidden rounded-xl bg-linear-to-r from-amber-500 to-orange-600 p-6 shadow-lg">
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-white/20 backdrop-blur-sm">
          <TagIcon className="h-6 w-6 text-white" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-bold text-white">タグでレシピを整理</h3>
          <p className="mt-1 text-sm text-orange-100">
            カテゴリとタグを使ってレシピを分類し、簡単に見つけられるようにしましょう
          </p>
        </div>
      </div>
    </div>
  )
}
