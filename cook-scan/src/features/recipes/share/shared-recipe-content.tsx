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
        <p className="text-sm font-medium text-emerald-600">共有レシピ</p>
        <h1 className="mt-1 text-2xl font-bold text-gray-900 sm:text-3xl">
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
      {recipe.ingredients.length > 0 && (
        <section>
          <h2 className="mb-4 text-lg font-bold text-gray-900">材料</h2>
          <div className="rounded-xl border border-gray-200 bg-white">
            <ul className="divide-y divide-gray-100">
              {recipe.ingredients.map((ingredient, index) => (
                <li key={index} className="flex items-center justify-between px-4 py-3">
                  <span className="text-sm text-gray-900">{ingredient.name}</span>
                  <span className="text-sm text-gray-500">
                    {[ingredient.unit, ingredient.notes].filter(Boolean).join(' ')}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* 手順 */}
      {recipe.steps.length > 0 && (
        <section>
          <h2 className="mb-4 text-lg font-bold text-gray-900">手順</h2>
          <ol className="space-y-4">
            {recipe.steps.map((step, index) => (
              <li key={index} className="flex gap-4 rounded-xl border border-gray-200 bg-white p-4">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-sm font-bold text-emerald-700">
                  {step.orderIndex}
                </span>
                <div className="flex-1">
                  <p className="text-sm text-gray-700">{step.instruction}</p>
                  {step.timerSeconds && (
                    <p className="mt-1 text-xs text-gray-500">
                      ⏱ {Math.floor(step.timerSeconds / 60)}分{step.timerSeconds % 60 > 0 ? `${step.timerSeconds % 60}秒` : ''}
                    </p>
                  )}
                </div>
              </li>
            ))}
          </ol>
        </section>
      )}

      {/* フッター */}
      <div className="border-t border-gray-200 pt-4 text-center text-xs text-gray-400">
        CookScan で作成されたレシピ
      </div>
    </div>
  )
}
