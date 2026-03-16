import Link from "next/link";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { FolderIcon } from "@/components/icons/folder-icon";
import { ChevronRightIcon } from "@/components/icons/chevron-right-icon";
import type { ChildRecipeRelation } from "@/types/recipe";

type RecipeChildRecipesSectionProps = {
  childRecipes: ChildRecipeRelation[];
};

export function RecipeChildRecipesSection({ childRecipes }: RecipeChildRecipesSectionProps) {
  if (childRecipes.length === 0) {
    return null;
  }

  return (
    <Card className="mb-8">
      <CardHeader
        icon={<FolderIcon className="h-5 w-5 text-white" />}
        iconColor="secondary"
        title="サブレシピ"
      />
      <CardContent>
        <div className="space-y-2">
          {childRecipes.map((relation) => (
            <Link
              key={relation.id}
              href={`/recipes/${relation.childRecipeId}`}
              className="from-secondary-light ring-secondary-light flex items-center justify-between rounded-lg bg-linear-to-r to-white p-3 ring-1 transition-all hover:shadow-md"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <div className="bg-secondary h-2 w-2 rounded-full" />
                  <span className="text-foreground font-semibold">
                    {relation.childRecipe.title}
                  </span>
                </div>
                {(relation.quantity || relation.notes) && (
                  <div className="text-muted-foreground mt-1 ml-4 flex items-center gap-3 text-sm">
                    {relation.quantity && <span>{relation.quantity}</span>}
                    {relation.notes && <span>{relation.notes}</span>}
                  </div>
                )}
              </div>
              <ChevronRightIcon className="text-muted-foreground h-4 w-4" />
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
