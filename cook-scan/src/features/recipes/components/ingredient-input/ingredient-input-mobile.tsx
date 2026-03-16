"use client";

import { Input } from "@/components/ui/input";
import { TrashIcon } from "@/components/icons/trash-icon";
import type { IngredientInputProps } from "./types";

export function IngredientInputMobile({
  ingredient,
  index,
  canDelete,
  onUpdate,
  onRemove,
}: IngredientInputProps) {
  return (
    <div className="group via-section-header/50 to-primary-light/30 ring-section-header-border/80 relative overflow-hidden rounded-2xl bg-linear-to-br from-white p-4 shadow-sm ring-1 transition-all duration-300 active:scale-[0.98]">
      {/* Decorative accent */}
      <div className="from-success via-primary to-secondary-hover absolute top-0 left-0 h-full w-1 bg-linear-to-b" />

      <div className="space-y-3 pl-2">
        {/* Row 1: Name */}
        <div>
          <label
            htmlFor={`ingredient-name-${index}`}
            className="text-muted-foreground mb-1.5 block text-xs font-semibold tracking-wide uppercase"
          >
            材料名
          </label>
          <Input
            id={`ingredient-name-${index}`}
            type="text"
            placeholder="例: 鶏もも肉"
            value={ingredient.name}
            onChange={(e) => onUpdate(index, "name", e.target.value)}
            variant="green"
            size="lg"
            className="font-medium"
          />
        </div>

        {/* Row 2: Unit */}
        <div>
          <label
            htmlFor={`ingredient-unit-${index}`}
            className="text-muted-foreground mb-1.5 block text-xs font-semibold tracking-wide uppercase"
          >
            分量
          </label>
          <Input
            id={`ingredient-unit-${index}`}
            type="text"
            placeholder="例: 300g、大さじ2、適量"
            value={ingredient.unit ?? ""}
            onChange={(e) => onUpdate(index, "unit", e.target.value)}
            variant="green"
            size="lg"
          />
        </div>

        {/* Row 3: Notes */}
        <div>
          <label
            htmlFor={`ingredient-notes-${index}`}
            className="text-muted-foreground mb-1.5 block text-xs font-semibold tracking-wide uppercase"
          >
            メモ
          </label>
          <Input
            id={`ingredient-notes-${index}`}
            type="text"
            placeholder="下処理や代替食材などのメモ..."
            value={ingredient.notes ?? ""}
            onChange={(e) => onUpdate(index, "notes", e.target.value)}
            variant="green"
            size="lg"
          />
        </div>

        {/* Row 4: Delete button */}
        <div className="flex justify-center pt-1">
          <button
            type="button"
            onClick={() => onRemove(index)}
            disabled={!canDelete}
            className="bg-muted text-muted-foreground hover:bg-danger-light hover:text-danger flex h-11 w-full items-center justify-center gap-2 rounded-xl text-sm font-medium transition-all duration-200 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40"
            aria-label="材料を削除"
          >
            <TrashIcon className="h-4 w-4" stroke="currentColor" />
            この材料を削除
          </button>
        </div>
      </div>
    </div>
  );
}
