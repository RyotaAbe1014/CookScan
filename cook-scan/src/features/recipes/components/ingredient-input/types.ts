import type { IngredientFormData } from "@/types/forms";

export type IngredientInputProps = {
  ingredient: IngredientFormData;
  index: number;
  canDelete: boolean;
  onUpdate: (index: number, field: "name" | "unit" | "notes", value: string) => void;
  onRemove: (index: number) => void;
};
