"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SearchIcon } from "@/components/icons/search-icon";
import { SpinnerIcon } from "@/components/icons/spinner-icon";
import { useRecipeSearch } from "./hooks/use-recipe-search";
import type { ChildRecipeSelectorDialogProps, ChildRecipeItem } from "./types";
import { cn } from "@/lib/tailwind";

export function ChildRecipeSelectorDialog({
  isOpen,
  onClose,
  onAdd,
  parentRecipeId,
  existingChildRecipeIds,
}: ChildRecipeSelectorDialogProps) {
  const [selectedRecipeId, setSelectedRecipeId] = useState<string | null>(null);
  const [quantity, setQuantity] = useState("");
  const [notes, setNotes] = useState("");

  const {
    searchQuery,
    setSearchQuery,
    recipes,
    isLoading,
    error,
    handleSearch,
    handleSearchKeyDown,
    reset,
  } = useRecipeSearch(parentRecipeId, existingChildRecipeIds, isOpen);

  const handleClose = () => {
    reset();
    setSelectedRecipeId(null);
    setQuantity("");
    setNotes("");
    onClose();
  };

  const handleAdd = () => {
    if (!selectedRecipeId) return;
    const selectedRecipe = recipes.find((r) => r.id === selectedRecipeId);
    if (!selectedRecipe) return;

    const item: ChildRecipeItem = {
      childRecipeId: selectedRecipe.id,
      childRecipeTitle: selectedRecipe.title,
      quantity,
      notes,
    };
    onAdd(item);
    handleClose();
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) handleClose();
      }}
    >
      <DialogContent className="gap-0 overflow-hidden border-none p-0 shadow-2xl sm:max-w-[600px]">
        {/* Header - Purple Gradient */}
        <DialogHeader className="from-secondary/10 via-secondary/5 border-secondary-light/50 border-b bg-gradient-to-br to-transparent p-6">
          <div className="space-y-1.5">
            <DialogTitle className="text-foreground flex items-center gap-2 text-xl font-bold tracking-tight">
              <span className="bg-secondary inline-block h-6 w-1.5 rounded-full" />
              サブレシピを追加
            </DialogTitle>
            <DialogDescription className="text-muted-foreground ml-3.5">
              親レシピに追加するサブレシピを選択してください。
            </DialogDescription>
          </div>
        </DialogHeader>

        <div className="space-y-6 p-6">
          {/* Search Bar */}
          <div className="flex gap-2">
            <div className="group relative flex-1">
              <SearchIcon className="text-muted-foreground group-focus-within:text-secondary pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transition-colors" />
              <Input
                placeholder="レシピを検索..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleSearchKeyDown}
                hasIcon
                className="focus:border-input-focus focus:ring-input-focus-ring transition-all duration-300"
              />
            </div>
            <Button
              onClick={() => handleSearch(searchQuery)}
              disabled={isLoading}
              variant="secondary"
              className="bg-secondary-light hover:bg-secondary-light text-secondary-hover border-secondary-light hover:border-secondary transition-colors"
            >
              検索
            </Button>
          </div>

          {/* Recipe List */}
          <div className="space-y-2">
            <div className="text-muted-foreground px-1 text-xs font-semibold tracking-wider uppercase">
              レシピ一覧
            </div>
            <div
              className="bg-section-header/50 scrollbar-thin scrollbar-thumb-section-header-border scrollbar-track-transparent relative h-[240px] space-y-2 overflow-y-auto rounded-xl border p-2"
              role="listbox"
              aria-label="レシピ一覧"
            >
              {isLoading ? (
                <div className="text-secondary/80 flex h-full flex-col items-center justify-center gap-2">
                  <SpinnerIcon className="h-8 w-8 animate-spin" />
                  <span className="text-xs font-medium">読み込み中...</span>
                </div>
              ) : error ? (
                <div className="text-destructive bg-danger-light/50 flex h-full items-center justify-center rounded-lg text-sm font-medium">
                  {error}
                </div>
              ) : recipes.length === 0 ? (
                <div className="text-muted-foreground flex h-full flex-col items-center justify-center gap-2 text-sm">
                  <SearchIcon className="h-8 w-8 opacity-20" />
                  <span>条件に一致するレシピは見つかりませんでした</span>
                </div>
              ) : (
                recipes.map((recipe) => (
                  <div
                    key={recipe.id}
                    role="option"
                    tabIndex={0}
                    aria-selected={selectedRecipeId === recipe.id}
                    onClick={() => setSelectedRecipeId(recipe.id)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        setSelectedRecipeId(recipe.id);
                      }
                    }}
                    className={cn(
                      "group flex cursor-pointer items-center rounded-lg border p-3 transition-all duration-200 ease-out",
                      selectedRecipeId === recipe.id
                        ? "border-secondary bg-secondary-light/80 ring-secondary/50 shadow-sm ring-1"
                        : "hover:border-secondary-light hover:bg-secondary-light/30 border-transparent bg-white hover:shadow-sm",
                    )}
                  >
                    <div
                      className={cn(
                        "mr-3 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border-2 transition-all duration-200",
                        selectedRecipeId === recipe.id
                          ? "border-secondary-hover bg-secondary-hover scale-110"
                          : "border-border-dark group-hover:border-secondary bg-white",
                      )}
                    >
                      {selectedRecipeId === recipe.id && (
                        <div className="animate-in zoom-in h-2 w-2 rounded-full bg-white shadow-sm duration-200" />
                      )}
                    </div>
                    <div
                      className={cn(
                        "text-sm font-medium transition-colors",
                        selectedRecipeId === recipe.id
                          ? "text-foreground"
                          : "text-foreground group-hover:text-foreground",
                      )}
                    >
                      {recipe.title}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Input Fields (Animated) */}
          <div
            className={cn(
              "border-muted grid grid-cols-2 gap-4 border-t border-dashed transition-all duration-500 ease-in-out",
              selectedRecipeId
                ? "max-h-[200px] translate-y-0 pt-4 opacity-100"
                : "pointer-events-none max-h-0 -translate-y-4 pt-0 opacity-0",
            )}
          >
            <div className="space-y-2">
              <label
                htmlFor="child-recipe-quantity"
                className="text-foreground ml-1 text-sm font-medium"
              >
                分量 <span className="text-muted-foreground text-xs font-normal">(任意)</span>
              </label>
              <Input
                id="child-recipe-quantity"
                placeholder="例: 200g"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="focus:border-input-focus focus:ring-input-focus-ring bg-section-header/30"
              />
            </div>
            <div className="space-y-2">
              <label
                htmlFor="child-recipe-notes"
                className="text-foreground ml-1 text-sm font-medium"
              >
                メモ <span className="text-muted-foreground text-xs font-normal">(任意)</span>
              </label>
              <Input
                id="child-recipe-notes"
                placeholder="例: 細かく刻む"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="focus:border-input-focus focus:ring-input-focus-ring bg-section-header/30"
              />
            </div>
          </div>
        </div>

        <DialogFooter className="bg-section-header/50 border-muted flex items-center justify-end gap-3 border-t p-6 pt-0">
          <Button
            variant="ghost"
            onClick={handleClose}
            className="hover:bg-muted hover:text-foreground text-muted-foreground"
          >
            キャンセル
          </Button>
          <Button
            onClick={handleAdd}
            disabled={!selectedRecipeId}
            className={cn(
              "shine-effect relative overflow-hidden transition-all duration-300",
              selectedRecipeId
                ? "bg-secondary-hover hover:bg-secondary-hover shadow-secondary/20 hover:shadow-secondary/30 w-full text-white shadow-md hover:shadow-lg sm:w-auto"
                : "bg-section-header-border text-muted-foreground cursor-not-allowed",
            )}
          >
            サブレシピを追加
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
