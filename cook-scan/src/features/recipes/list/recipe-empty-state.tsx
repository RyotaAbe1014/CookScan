import Link from "next/link";
import { EmptyIcon } from "@/components/icons/empty-icon";
import { CloseIcon } from "@/components/icons/close-icon";
import { PlusIcon } from "@/components/icons/plus-icon";

type RecipeEmptyStateProps = {
  hasFilters: boolean;
  hasSearchQuery: boolean;
  hasSelectedTags: boolean;
};

export function RecipeEmptyState({
  hasFilters,
  hasSearchQuery,
  hasSelectedTags,
}: RecipeEmptyStateProps) {
  return (
    <div className="rounded-xl bg-white p-12 text-center shadow-lg">
      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-linear-to-br from-muted to-section-header-border">
        <EmptyIcon className="h-10 w-10 text-muted-foreground" />
      </div>
      {hasFilters ? (
        <>
          <h3 className="mt-6 text-lg font-semibold text-foreground">該当するレシピがありません</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            {hasSearchQuery && hasSelectedTags
              ? "検索条件とタグに一致するレシピが見つかりませんでした"
              : hasSearchQuery
                ? "検索条件に一致するレシピが見つかりませんでした"
                : "選択したタグに一致するレシピが見つかりませんでした"}
          </p>
          <div className="mt-6">
            <Link
              href="/recipes"
              className="inline-flex items-center gap-2 rounded-lg border-2 border-border-dark bg-white px-4 py-2 text-sm font-semibold text-foreground shadow-sm transition-all hover:border-primary-light hover:bg-primary-light"
            >
              <CloseIcon className="h-4 w-4" />
              すべてクリア
            </Link>
          </div>
        </>
      ) : (
        <>
          <h3 className="mt-6 text-lg font-semibold text-foreground">レシピがまだありません</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            レシピをスキャンして、マイレシピに追加しましょう
          </p>
          <div className="mt-6">
            <Link
              href="/recipes/upload"
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-primary/30 transition-all hover:shadow-xl hover:shadow-primary/40"
            >
              <PlusIcon className="h-5 w-5" />
              レシピをスキャン
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
