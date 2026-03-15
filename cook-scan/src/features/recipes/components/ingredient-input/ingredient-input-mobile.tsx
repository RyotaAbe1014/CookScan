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
    <div className="group relative overflow-hidden rounded-2xl bg-linear-to-br from-white via-section-header/50 to-primary-light/30 p-4 shadow-sm ring-1 ring-section-header-border/80 transition-all duration-300 active:scale-[0.98]">
      {/* Decorative accent */}
      <div className="absolute left-0 top-0 h-full w-1 bg-linear-to-b from-success via-primary to-secondary-hover" />

      <div className="space-y-3 pl-2">
        {/* Row 1: Name */}
        <div>
          <label
            htmlFor={`ingredient-name-${index}`}
            className="mb-1.5 block text-xs font-semibold tracking-wide text-muted-foreground uppercase"
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
            className="mb-1.5 block text-xs font-semibold tracking-wide text-muted-foreground uppercase"
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
            className="mb-1.5 block text-xs font-semibold tracking-wide text-muted-foreground uppercase"
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
            className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-muted text-sm font-medium text-muted-foreground transition-all duration-200 hover:bg-danger-light hover:text-danger active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40"
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
