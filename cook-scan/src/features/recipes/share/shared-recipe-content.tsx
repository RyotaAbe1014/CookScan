import Image from 'next/image'
import type { SharedRecipeOutput } from '@/backend/domain/recipes'

type Props = {
  recipe: SharedRecipeOutput
}

export function SharedRecipeContent({ recipe }: Props) {
  return (
    <div className="space-y-8">
      {/* ヘッダー */}
      <div>
        <p className="text-sm font-medium text-primary">共有レシピ</p>
        <h1 className="mt-1 text-2xl font-bold text-foreground sm:text-3xl">
          {recipe.title}
        </h1>
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
          <h2 className="mb-4 text-lg font-bold text-foreground">材料</h2>
          <div className="rounded-xl border border-border bg-white">
            <ul className="divide-y divide-muted">
              {recipe.ingredients.map((ingredient, index) => (
                <li key={index} className="flex items-center justify-between px-4 py-3">
                  <span className="text-sm text-foreground">{ingredient.name}</span>
                  <span className="text-sm text-muted-foreground">
                    {[ingredient.unit, ingredient.notes].filter(Boolean).join(' ')}
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
          <h2 className="mb-4 text-lg font-bold text-foreground">手順</h2>
          <ol className="space-y-4">
            {recipe.steps.map((step, index) => (
              <li key={index} className="flex gap-4 rounded-xl border border-border bg-white p-4">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary-light text-sm font-bold text-primary-hover">
                  {step.orderIndex}
                </span>
                <div className="flex-1">
                  <p className="text-sm text-foreground">{step.instruction}</p>
                  {step.timerSeconds && (
                    <p className="mt-1 text-xs text-muted-foreground">
                      ⏱ {Math.floor(step.timerSeconds / 60)}分{step.timerSeconds % 60 > 0 ? `${step.timerSeconds % 60}秒` : ''}
                    </p>
                  )}
                </div>
              </li>
            ))}
          </ol>
        </section>
      ) : null}

      {/* フッター */}
      <div className="border-t border-border pt-4 text-center text-xs text-muted-foreground">
        CookScan で作成されたレシピ
      </div>
    </div>
  )
}
