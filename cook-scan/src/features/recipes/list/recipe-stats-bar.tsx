import Link from "next/link";
import { BookOpenIcon } from "@/components/icons/book-open-icon";
import { PlusIcon } from "@/components/icons/plus-icon";

type RecipeStatsBarProps = {
  recipeCount: number;
};

export function RecipeStatsBar({ recipeCount }: RecipeStatsBarProps) {
  return (
    <div className="mb-6 flex items-center justify-between rounded-xl bg-white p-4 shadow-md">
      <div className="flex items-center gap-3">
        <div className="from-success to-primary flex h-10 w-10 items-center justify-center rounded-lg bg-linear-to-br">
          <BookOpenIcon className="h-5 w-5 text-white" />
        </div>
        <div>
          <p className="text-muted-foreground text-sm">保存レシピ数</p>
          <p className="text-foreground text-2xl font-bold">{recipeCount}</p>
        </div>
      </div>
      <Link
        href="/recipes/upload"
        className="bg-primary shadow-primary/30 hover:shadow-primary/40 flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold text-white shadow-lg transition-all hover:shadow-xl"
      >
        <PlusIcon className="h-4 w-4" />
        レシピをスキャン
      </Link>
    </div>
  );
}
