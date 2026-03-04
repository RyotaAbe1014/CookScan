import Link from 'next/link'
import { BookOpenIcon } from '@/components/icons/book-open-icon'
import { PlusIcon } from '@/components/icons/plus-icon'

type RecipeStatsBarProps = {
  recipeCount: number
}

export function RecipeStatsBar({ recipeCount }: RecipeStatsBarProps) {
  return (
    <div className="mb-6 flex items-center justify-between rounded-xl bg-white p-4 shadow-md">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-linear-to-br from-success to-primary">
          <BookOpenIcon className="h-5 w-5 text-white" />
        </div>
        <div>
          <p className="text-sm text-muted-foreground">保存レシピ数</p>
          <p className="text-2xl font-bold text-foreground">{recipeCount}</p>
        </div>
      </div>
      <Link
        href="/recipes/upload"
        className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-primary/30 transition-all hover:shadow-xl hover:shadow-primary/40"
      >
        <PlusIcon className="h-4 w-4" />
        レシピをスキャン
      </Link>
    </div>
  )
}
