import { EmptyState } from '@/components/ui/empty-state'
import { ClipboardListIcon } from '@/components/icons/clipboard-list-icon'

export function ShoppingListEmptyState() {
  return (
    <EmptyState
      icon={<ClipboardListIcon className="h-10 w-10 text-muted-foreground" />}
      title="買い物リストは空です"
      description="上のフォームからアイテムを追加してみましょう"
    />
  )
}
