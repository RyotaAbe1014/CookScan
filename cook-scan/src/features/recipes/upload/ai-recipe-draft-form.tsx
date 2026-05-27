"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { RecipeFormTagCategory } from "@/features/recipes/types/tag";
import { createRecipe } from "./actions";
import { isSuccess } from "@/utils/result";
import { useRecipeForm } from "@/features/recipes/hooks/use-recipe-form";
import { Alert } from "@/components/ui/alert";
import { Card, CardContent } from "@/components/ui/card";
import {
  BasicInfoSection,
  ChildRecipeSection,
  FormActions,
  IngredientSection,
  StepSection,
  TagSection,
} from "@/features/recipes/components";

export type AiRecipeDraft = {
  title: string;
  ingredients: Array<{
    name: string;
    unit: string;
    notes: string | null;
  }>;
  steps: Array<{
    instruction: string;
    timerSeconds: number | null;
  }>;
  memo: string | null;
};

type Props = {
  draft: AiRecipeDraft;
  tagCategories: RecipeFormTagCategory[];
  onCancel: () => void;
};

export function AiRecipeDraftForm({ draft, tagCategories, onCancel }: Props) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isChildRecipeDialogOpen, setIsChildRecipeDialogOpen] = useState(false);

  const {
    title,
    setTitle,
    sourceInfo,
    setSourceInfo,
    ingredients,
    steps,
    memo,
    setMemo,
    selectedTagIds,
    childRecipes,
    addIngredient,
    removeIngredient,
    updateIngredient,
    addStep,
    removeStep,
    updateStep,
    addChildRecipe,
    removeChildRecipe,
    updateChildRecipe,
    toggleTag,
  } = useRecipeForm({
    initialData: {
      title: draft.title,
      sourceInfo: {
        bookName: "",
        pageNumber: "",
        url: "",
      },
      ingredients: draft.ingredients.map((ingredient) => ({
        name: ingredient.name,
        unit: ingredient.unit,
        notes: ingredient.notes ?? "",
      })),
      steps: draft.steps.map((step, index) => ({
        instruction: step.instruction,
        timerSeconds: step.timerSeconds ?? undefined,
        orderIndex: index + 1,
      })),
      memo: draft.memo ?? "",
      selectedTagIds: [],
      childRecipes: [],
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const result = await createRecipe({
        title,
        sourceInfo:
          sourceInfo.bookName || sourceInfo.pageNumber || sourceInfo.url ? sourceInfo : null,
        ingredients,
        steps,
        memo,
        tags: selectedTagIds,
        childRecipes: childRecipes.map((cr) => ({
          childRecipeId: cr.childRecipeId,
          quantity: cr.quantity || undefined,
          notes: cr.notes || undefined,
        })),
      });

      if (isSuccess(result)) {
        router.push(`/recipes/${result.data.recipeId}`);
      } else {
        setError(result.error.message);
        setIsSubmitting(false);
      }
    } catch (err) {
      console.error("Error creating AI recipe draft:", err);
      setError("エラーが発生しました");
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && <Alert variant="error">{error}</Alert>}

      <BasicInfoSection
        title={title}
        onTitleChange={setTitle}
        sourceInfo={sourceInfo}
        onSourceInfoChange={setSourceInfo}
        memo={memo}
        onMemoChange={setMemo}
      />

      <TagSection
        tagCategories={tagCategories}
        selectedTagIds={selectedTagIds}
        onToggleTag={toggleTag}
      />

      <IngredientSection
        ingredients={ingredients}
        onAdd={addIngredient}
        onUpdate={updateIngredient}
        onRemove={removeIngredient}
      />

      <ChildRecipeSection
        childRecipes={childRecipes}
        isDialogOpen={isChildRecipeDialogOpen}
        onOpenDialog={() => setIsChildRecipeDialogOpen(true)}
        onCloseDialog={() => setIsChildRecipeDialogOpen(false)}
        onAdd={addChildRecipe}
        onUpdate={updateChildRecipe}
        onRemove={removeChildRecipe}
      />

      <StepSection steps={steps} onAdd={addStep} onUpdate={updateStep} onRemove={removeStep} />

      <Card>
        <CardContent>
          <FormActions
            isSubmitting={isSubmitting}
            disabled={!title}
            submitLabel="レシピを保存"
            onCancel={onCancel}
          />
        </CardContent>
      </Card>
    </form>
  );
}
