"use client";

import { useTransition } from "react";
import type { ShoppingItemOutput } from "@/backend/domain/shopping-items";
import { deleteShoppingItem } from "@/features/shopping-list/actions";
import { isSuccess } from "@/utils/result";
import { Button } from "@/components/ui/button";
import { CheckIcon } from "@/components/icons/check-icon";
import { PencilIcon } from "@/components/icons/pencil-icon";
import { TrashIcon } from "@/components/icons/trash-icon";
import { cn } from "@/lib/tailwind";

type ShoppingItemRowProps = {
  item: ShoppingItemOutput;
  onEdit: () => void;
  onToggleCheck: (itemId: string) => void;
};

export function ShoppingItemRow({ item, onEdit, onToggleCheck }: ShoppingItemRowProps) {
  const [isDeletePending, startDeleteTransition] = useTransition();

  const handleDelete = () => {
    startDeleteTransition(async () => {
      const result = await deleteShoppingItem(item.id);
      if (!isSuccess(result)) {
        console.error("Failed to delete item:", result.error.message);
      }
    });
  };

  return (
    <li className="hover:bg-section-header flex items-center gap-3 px-4 py-3 transition-colors duration-150">
      {/* チェックボックス */}
      <button
        type="button"
        onClick={() => onToggleCheck(item.id)}
        className={cn(
          "flex h-6 w-6 shrink-0 cursor-pointer items-center justify-center rounded-md border-2 transition-all duration-200",
          "focus-visible:ring-primary focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none",
          item.isChecked
            ? "border-primary bg-primary text-white"
            : "border-border-dark hover:border-primary bg-white",
        )}
        aria-label={item.isChecked ? "チェックを外す" : "チェックする"}
      >
        {item.isChecked && <CheckIcon className="h-4 w-4" />}
      </button>

      {/* アイテム情報（クリックでチェック切替） */}
      <button
        type="button"
        className="min-w-0 flex-1 cursor-pointer text-left"
        onClick={() => onToggleCheck(item.id)}
      >
        <p
          className={cn(
            "text-sm font-medium transition-colors duration-200",
            item.isChecked ? "text-muted-foreground line-through" : "text-foreground",
          )}
        >
          {item.name}
        </p>
        {item.memo && <p className="text-muted-foreground mt-0.5 truncate text-xs">{item.memo}</p>}
      </button>

      {/* アクションボタン */}
      <div className="flex shrink-0 items-center gap-1">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={(e) => {
            e.stopPropagation();
            onEdit();
          }}
          className="h-8 w-8"
          aria-label="編集"
        >
          <PencilIcon className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="danger-ghost"
          size="icon"
          onClick={(e) => {
            e.stopPropagation();
            handleDelete();
          }}
          disabled={isDeletePending}
          isLoading={isDeletePending}
          className="h-8 w-8"
          aria-label="削除"
        >
          {!isDeletePending && <TrashIcon className="h-4 w-4" />}
        </Button>
      </div>
    </li>
  );
}
