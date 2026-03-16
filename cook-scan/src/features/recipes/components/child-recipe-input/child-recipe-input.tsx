"use client";

import { Input } from "@/components/ui/input";
import { TrashIcon } from "@/components/icons/trash-icon";
import type { ChildRecipeInputProps } from "./types";

export function ChildRecipeInput({ item, index, onUpdate, onRemove }: ChildRecipeInputProps) {
  return (
    <div className="from-secondary-light ring-secondary-light rounded-lg bg-linear-to-r to-white p-4 ring-1">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-secondary h-2 w-2 rounded-full" />
          <span className="text-foreground font-semibold">{item.childRecipeTitle}</span>
        </div>
        <button
          type="button"
          onClick={() => onRemove(index)}
          className="text-muted-foreground hover:bg-danger-light hover:text-danger rounded-lg p-1.5 transition-colors"
          aria-label={`${item.childRecipeTitle}を削除`}
        >
          <TrashIcon className="h-4 w-4" />
        </button>
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div>
          <label
            htmlFor={`child-recipe-quantity-${index}`}
            className="text-muted-foreground mb-1 block text-xs font-medium"
          >
            分量
          </label>
          <Input
            id={`child-recipe-quantity-${index}`}
            type="text"
            value={item.quantity}
            onChange={(e) => onUpdate(index, "quantity", e.target.value)}
            placeholder="例: 大さじ2"
          />
        </div>
        <div>
          <label
            htmlFor={`child-recipe-notes-${index}`}
            className="text-muted-foreground mb-1 block text-xs font-medium"
          >
            メモ
          </label>
          <Input
            id={`child-recipe-notes-${index}`}
            type="text"
            value={item.notes}
            onChange={(e) => onUpdate(index, "notes", e.target.value)}
            placeholder="例: 事前に作っておく"
          />
        </div>
      </div>
    </div>
  );
}
