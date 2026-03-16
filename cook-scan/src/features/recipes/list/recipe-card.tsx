import Image from "next/image";
import { ClipboardListIcon } from "@/components/icons/clipboard-list-icon";
import { ClockIcon } from "@/components/icons/clock-icon";
import { TagIcon } from "@/components/icons/tag-icon";
import type { RecipeBasic } from "@/types/recipe";

type RecipeCardProps = {
  recipe: RecipeBasic;
  badge?: React.ReactNode;
};

function formatRecipeDate(date: Date) {
  return new Date(date).toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function RecipeCard({ recipe, badge }: RecipeCardProps) {
  return (
    <article className="ring-card-border h-full overflow-hidden rounded-xl bg-white shadow-md ring-1 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      {recipe.imageUrl && (
        <div className="bg-section-header-border relative h-40 overflow-hidden">
          <Image
            src={recipe.imageUrl}
            alt={recipe.title}
            width={400}
            height={160}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent" />
        </div>
      )}

      <div className="p-5">
        <div className="space-y-2">
          {badge}
          <h3 className="text-foreground group-hover:text-primary text-lg font-bold transition-colors">
            {recipe.title}
          </h3>
        </div>

        <div className="text-muted-foreground mt-2 flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1">
            <ClipboardListIcon className="text-primary h-4 w-4" />
            <span className="font-medium">{recipe.ingredients.length}</span>
            <span className="text-muted-foreground">品目</span>
          </div>
        </div>

        {recipe.recipeTags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {recipe.recipeTags.slice(0, 3).map((recipeTag) => (
              <span
                key={recipeTag.tagId}
                className="bg-warning-light text-warning ring-warning-light inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium ring-1"
              >
                <TagIcon className="h-3 w-3" />
                {recipeTag.tag.name}
              </span>
            ))}
            {recipe.recipeTags.length > 3 && (
              <span className="bg-muted text-muted-foreground inline-flex items-center rounded-md px-2 py-1 text-xs font-medium">
                +{recipe.recipeTags.length - 3}
              </span>
            )}
          </div>
        )}

        <div className="border-muted text-muted-foreground mt-4 flex items-center gap-1.5 border-t pt-3 text-xs">
          <ClockIcon className="h-3.5 w-3.5" />
          {formatRecipeDate(recipe.createdAt)}
        </div>
      </div>
    </article>
  );
}
