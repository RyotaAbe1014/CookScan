import { ClipboardListIcon } from '@/components/icons/clipboard-list-icon'

type ShoppingListStatsBarProps = {
  totalCount: number
  checkedCount: number
}

export function ShoppingListStatsBar({ totalCount, checkedCount }: ShoppingListStatsBarProps) {
  const remainingCount = totalCount - checkedCount

  return (
    <div className="mb-6 flex items-center gap-3 rounded-xl bg-white px-5 py-3 shadow-card ring-1 ring-gray-900/5">
      <ClipboardListIcon className="h-5 w-5 text-primary" />
      <div className="flex items-center gap-4 text-sm">
        <span className="font-semibold text-foreground">
          {totalCount}件
        </span>
        {totalCount > 0 && (
          <>
            <span className="text-muted-foreground">
              残り {remainingCount}件
            </span>
            {checkedCount > 0 && (
              <span className="text-emerald-600">
                {checkedCount}件 購入済み
              </span>
            )}
          </>
        )}
      </div>
    </div>
  )
}
