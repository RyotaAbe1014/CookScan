import { ClipboardListIcon } from "@/components/icons/clipboard-list-icon";

type ShoppingListStatsBarProps = {
  totalCount: number;
  checkedCount: number;
};

export function ShoppingListStatsBar({ totalCount, checkedCount }: ShoppingListStatsBarProps) {
  const remainingCount = totalCount - checkedCount;

  return (
    <div className="shadow-card ring-card-border mb-6 flex items-center gap-3 rounded-xl bg-white px-5 py-3 ring-1">
      <ClipboardListIcon className="text-primary h-5 w-5" />
      <div className="flex items-center gap-4 text-sm">
        <span className="text-foreground font-semibold">{totalCount}件</span>
        {totalCount > 0 && (
          <>
            <span className="text-muted-foreground">残り {remainingCount}件</span>
            {checkedCount > 0 && <span className="text-primary">{checkedCount}件 購入済み</span>}
          </>
        )}
      </div>
    </div>
  );
}
