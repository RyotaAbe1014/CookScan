import Link from "next/link";
import { BookOpenIcon } from "@/components/icons/book-open-icon";
import { ChevronRightIcon } from "@/components/icons/chevron-right-icon";
import { EmptyIcon } from "@/components/icons/empty-icon";
import { PlusIcon } from "@/components/icons/plus-icon";
import { EmptyState } from "@/components/ui/empty-state";
import { RecipeCard } from "@/features/recipes/list/recipe-card";
import type { RecipeBasic } from "@/types/recipe";

type RecentRecipesSectionProps = {
  recipes: RecipeBasic[];
};

export function RecentRecipesSection({ recipes }: RecentRecipesSectionProps) {
  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-primary h-1 w-12 rounded-full" />
          <h2 className="text-foreground text-2xl font-bold">最近追加したレシピ</h2>
        </div>

        <Link
          href="/recipes"
          className="text-primary hover:text-primary-hover inline-flex items-center gap-1 text-sm font-semibold transition-colors"
        >
          すべて見る
          <ChevronRightIcon className="h-4 w-4" />
        </Link>
      </div>

      {recipes.length === 0 ? (
        <EmptyState
          icon={<EmptyIcon className="text-muted-foreground h-10 w-10" />}
          title="最近追加したレシピがありません"
          description="レシピをスキャンして、まずは1件追加しましょう"
          action={
            <Link
              href="/recipes/upload"
              className="bg-primary shadow-primary/30 hover:shadow-primary/40 inline-flex items-center gap-2 rounded-lg px-6 py-3 text-sm font-semibold text-white shadow-lg transition-all hover:shadow-xl"
            >
              <PlusIcon className="h-5 w-5" />
              レシピをスキャン
            </Link>
          }
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {recipes.map((recipe) => (
            <Link key={recipe.id} href={`/recipes/${recipe.id}`} className="group">
              <RecipeCard
                recipe={recipe}
                badge={
                  <div className="bg-primary-light text-primary inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold">
                    <BookOpenIcon className="h-3.5 w-3.5" />
                    最近追加
                  </div>
                }
              />
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
