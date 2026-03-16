import Image from "next/image";
import type { SharedRecipeOutput } from "@/backend/domain/recipes";

type Props = {
  recipe: SharedRecipeOutput;
};

export function SharedRecipeContent({ recipe }: Props) {
  return (
    <div className="space-y-8">
      {/* ヘッダー */}
      <div>
        <p className="text-primary text-sm font-medium">共有レシピ</p>
        <h1 className="text-foreground mt-1 text-2xl font-bold sm:text-3xl">{recipe.title}</h1>
      </div>

      {/* 画像 */}
      {recipe.imageUrl && (
        <div className="overflow-hidden rounded-xl">
          <Image
            src={recipe.imageUrl}
            alt={recipe.title}
            width={800}
            height={600}
            className="h-auto w-full object-cover"
          />
        </div>
      )}

      {/* 材料 */}
      {recipe.ingredients.length > 0 ? (
        <section>
          <h2 className="text-foreground mb-4 text-lg font-bold">材料</h2>
          <div className="border-border rounded-xl border bg-white">
            <ul className="divide-muted divide-y">
              {recipe.ingredients.map((ingredient, index) => (
                <li key={index} className="flex items-center justify-between px-4 py-3">
                  <span className="text-foreground text-sm">{ingredient.name}</span>
                  <span className="text-muted-foreground text-sm">
                    {[ingredient.unit, ingredient.notes].filter(Boolean).join(" ")}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      {/* 手順 */}
      {recipe.steps.length > 0 ? (
        <section>
          <h2 className="text-foreground mb-4 text-lg font-bold">手順</h2>
          <ol className="space-y-4">
            {recipe.steps.map((step, index) => (
              <li key={index} className="border-border flex gap-4 rounded-xl border bg-white p-4">
                <span className="bg-primary-light text-primary-hover flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-sm font-bold">
                  {step.orderIndex}
                </span>
                <div className="flex-1">
                  <p className="text-foreground text-sm">{step.instruction}</p>
                  {step.timerSeconds && (
                    <p className="text-muted-foreground mt-1 text-xs">
                      ⏱ {Math.floor(step.timerSeconds / 60)}分
                      {step.timerSeconds % 60 > 0 ? `${step.timerSeconds % 60}秒` : ""}
                    </p>
                  )}
                </div>
              </li>
            ))}
          </ol>
        </section>
      ) : null}

      {/* フッター */}
      <div className="border-border text-muted-foreground border-t pt-4 text-center text-xs">
        CookScan で作成されたレシピ
      </div>
    </div>
  );
}
