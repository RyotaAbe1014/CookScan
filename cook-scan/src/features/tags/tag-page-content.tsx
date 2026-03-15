import { TagCreateForm } from "./tag-create-form";
import { CategoryItem } from "./category-item";
import { TagEmptyState } from "./tag-empty-state";
import type { TagCategoryWithTags } from "@/types/tag";
import { TagIcon } from "@/components/icons/tag-icon";

type TagPageContentProps = {
  tagCategories: TagCategoryWithTags[];
  currentUserId: string;
};

export function TagPageContent({ tagCategories, currentUserId }: TagPageContentProps) {
  return (
    <div className="space-y-8">
      <TagCreateForm categories={tagCategories} />

      {/* タグ一覧セクション */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">登録済みのタグ</h2>
          <p className="mt-1 text-sm text-muted-foreground">カテゴリごとに整理されたタグ一覧</p>
        </div>
        {tagCategories.length > 0 && (
          <div className="flex items-center gap-2 rounded-lg bg-primary-light px-4 py-2 border border-primary-light">
            <TagIcon className="h-5 w-5 text-primary" />
            <span className="text-sm font-medium text-foreground">
              {tagCategories.length} カテゴリ
            </span>
          </div>
        )}
      </div>

      {tagCategories.length === 0 ? (
        <TagEmptyState />
      ) : (
        <div className="space-y-6">
          {tagCategories.map((category) => (
            <CategoryItem key={category.id} category={category} currentUserId={currentUserId} />
          ))}
        </div>
      )}
    </div>
  );
}
