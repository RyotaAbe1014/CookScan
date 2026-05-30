"use client";

import { useEffect, useState } from "react";
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
import { Alert } from "@/components/ui/alert";
import { getRecipesWithFilters } from "@/features/recipes/list/actions";
import { isSuccess } from "@/utils/result";

export type ReferenceRecipe = {
  id: string;
  title: string;
};

type Props = {
  open: boolean;
  onClose: () => void;
  /** 既に参照中のレシピ（選択済み表示・確定時のマージに使う） */
  selected: ReferenceRecipe[];
  /** 「追加」確定時に呼ばれる。確定後の参照レシピ全体を渡す */
  onConfirm: (recipes: ReferenceRecipe[]) => void;
};

export function ReferenceRecipePicker({ open, onClose, selected, onConfirm }: Props) {
  const [searchQuery, setSearchQuery] = useState("");
  const [recipes, setRecipes] = useState<ReferenceRecipe[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // モーダルを開くたびに、現在の参照中レシピを初期選択として復元する。
  useEffect(() => {
    if (open) {
      setSelectedIds(new Set(selected.map((recipe) => recipe.id)));
      setSearchQuery("");
    }
  }, [open, selected]);

  // 検索クエリに応じてレシピ一覧を取得する（デバウンス付き）。
  useEffect(() => {
    if (!open) return;

    let cancelled = false;
    setIsLoading(true);
    setError(null);

    const timer = setTimeout(async () => {
      const result = await getRecipesWithFilters(searchQuery, []);
      if (cancelled) return;

      if (isSuccess(result)) {
        setRecipes(result.data.map((recipe) => ({ id: recipe.id, title: recipe.title })));
      } else {
        setError(result.error.message);
      }
      setIsLoading(false);
    }, 250);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [open, searchQuery]);

  const toggle = (id: string) => {
    setSelectedIds((current) => {
      const next = new Set(current);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleConfirm = () => {
    // 一覧に出ていない（検索で絞られた）選択済みレシピも維持するため、
    // 既存の selected と今回の一覧の両方からタイトルを引く。
    const titleById = new Map<string, string>();
    selected.forEach((recipe) => titleById.set(recipe.id, recipe.title));
    recipes.forEach((recipe) => titleById.set(recipe.id, recipe.title));

    const confirmed: ReferenceRecipe[] = Array.from(selectedIds).map((id) => ({
      id,
      title: titleById.get(id) ?? "（タイトル不明）",
    }));
    onConfirm(confirmed);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(value) => !value && onClose()}>
      <DialogContent maxWidth="max-w-xl">
        <DialogHeader>
          <DialogTitle>参照するレシピを選ぶ</DialogTitle>
          <DialogDescription>
            選んだレシピを素材に、AIが合成・アレンジした新しいレシピを提案します
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 px-6 py-5">
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="レシピ名で検索"
          />

          {error && <Alert variant="error">{error}</Alert>}

          <div className="max-h-[360px] space-y-2 overflow-y-auto">
            {isLoading ? (
              <p className="text-muted-foreground py-8 text-center text-sm">読み込み中...</p>
            ) : recipes.length === 0 ? (
              <p className="text-muted-foreground py-8 text-center text-sm">
                レシピが見つかりませんでした
              </p>
            ) : (
              recipes.map((recipe) => {
                const checked = selectedIds.has(recipe.id);
                return (
                  <label
                    key={recipe.id}
                    className={`flex cursor-pointer items-center gap-3 rounded-lg border px-4 py-3 text-sm transition-colors ${
                      checked
                        ? "border-primary bg-primary/5"
                        : "border-border hover:bg-muted/40"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggle(recipe.id)}
                      className="accent-primary h-4 w-4"
                    />
                    <span className="text-foreground">{recipe.title}</span>
                  </label>
                );
              })
            )}
          </div>
        </div>

        <DialogFooter>
          <Button type="button" variant="secondary" onClick={onClose} className="flex-1">
            キャンセル
          </Button>
          <Button type="button" onClick={handleConfirm} className="flex-1">
            {selectedIds.size > 0 ? `${selectedIds.size}件を参照に追加` : "追加"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
