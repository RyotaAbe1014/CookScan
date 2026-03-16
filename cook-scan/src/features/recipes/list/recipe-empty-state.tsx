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
      <div className="from-muted to-section-header-border mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-linear-to-br">
        <EmptyIcon className="text-muted-foreground h-10 w-10" />
      </div>
      {hasFilters ? (
        <>
          <h3 className="text-foreground mt-6 text-lg font-semibold">該当するレシピがありません</h3>
          <p className="text-muted-foreground mt-2 text-sm">
            {hasSearchQuery && hasSelectedTags
              ? "検索条件とタグに一致するレシピが見つかりませんでした"
              : hasSearchQuery
                ? "検索条件に一致するレシピが見つかりませんでした"
                : "選択したタグに一致するレシピが見つかりませんでした"}
          </p>
          <div className="mt-6">
            <Link
              href="/recipes"
              className="border-border-dark text-foreground hover:border-primary-light hover:bg-primary-light inline-flex items-center gap-2 rounded-lg border-2 bg-white px-4 py-2 text-sm font-semibold shadow-sm transition-all"
            >
              <CloseIcon className="h-4 w-4" />
              すべてクリア
            </Link>
          </div>
        </>
      ) : (
        <>
          <h3 className="text-foreground mt-6 text-lg font-semibold">レシピがまだありません</h3>
          <p className="text-muted-foreground mt-2 text-sm">
            レシピをスキャンして、マイレシピに追加しましょう
          </p>
          <div className="mt-6">
            <Link
              href="/recipes/upload"
              className="bg-primary shadow-primary/30 hover:shadow-primary/40 inline-flex items-center gap-2 rounded-lg px-6 py-3 text-sm font-semibold text-white shadow-lg transition-all hover:shadow-xl"
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
