import { Card, CardHeader, CardContent } from "@/components/ui/card";
import type { RecipeTag } from "@/types/recipe";
import { groupTagsByCategory } from "./utils";
import { TagIcon } from "@/components/icons/tag-icon";

type RecipeTagsSectionProps = {
  recipeTags: RecipeTag[];
};

export function RecipeTagsSection({ recipeTags }: RecipeTagsSectionProps) {
  if (recipeTags.length === 0) {
    return null;
  }

  const tagsByCategory = groupTagsByCategory(recipeTags);

  return (
    <Card className="mb-6">
      <CardHeader
        icon={<TagIcon className="h-5 w-5 text-white" />}
        iconColor="accent-tags"
        title="タグ"
      />
      <CardContent>
        <div className="space-y-4">
          {[...tagsByCategory.entries()].map(([categoryId, category]) => (
            <div key={categoryId}>
              <div className="mb-2 flex items-center gap-2">
                <div className="bg-warning h-1 w-1 rounded-full" />
                <h4 className="text-foreground text-sm font-semibold">{category.name}</h4>
              </div>
              <div className="flex flex-wrap gap-2">
                {category.tags.map((tag) => (
                  <span
                    key={tag.id}
                    className="bg-warning-light text-warning ring-warning-light inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium ring-1"
                  >
                    <TagIcon className="h-3.5 w-3.5" />
                    {tag.name}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
