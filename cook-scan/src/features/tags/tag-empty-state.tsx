import { TagIcon } from "@/components/icons/tag-icon";
import { InfoSolidIcon } from "@/components/icons/info-solid-icon";

export function TagEmptyState() {
  return (
    <div className="overflow-hidden rounded-xl bg-white p-12 text-center shadow-lg">
      <div className="from-muted to-section-header-border mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-linear-to-br">
        <TagIcon className="text-muted-foreground h-10 w-10" />
      </div>
      <h3 className="text-foreground mt-6 text-lg font-semibold">タグがまだありません</h3>
      <p className="text-muted-foreground mt-2 text-sm">
        上のフォームからタグとカテゴリを作成して、レシピを整理しましょう
      </p>
      <div className="mt-6 flex justify-center gap-2">
        <div className="bg-accent-steps-light text-accent-steps flex items-center gap-2 rounded-lg px-4 py-2 text-sm">
          <InfoSolidIcon className="h-4 w-4" />
          カテゴリを作成してからタグを追加
        </div>
      </div>
    </div>
  );
}
