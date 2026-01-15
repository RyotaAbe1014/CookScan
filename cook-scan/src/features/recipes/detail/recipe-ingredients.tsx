import { Card, CardHeader, CardContent } from '@/components/ui/card'
import { BeakerIcon } from '@/components/icons/beaker-icon'
import type { Ingredient } from '@/types/ingredient'

type RecipeIngredientsProps = {
  ingredients: Ingredient[]
}

export function RecipeIngredients({ ingredients }: RecipeIngredientsProps) {
  return (
    <Card className="mb-8">
      <CardHeader
        icon={
          <BeakerIcon className="h-5 w-5 text-white" />
        }
        iconColor="green"
        title="材料"
      />
      <CardContent>
        {ingredients.length > 0 ? (
          <div className="space-y-2">
            {ingredients.map((ingredient) => (
              <div
                key={ingredient.id}
                className="flex items-center justify-between rounded-lg bg-linear-to-r from-gray-50 to-white p-3 ring-1 ring-gray-200 transition-all hover:shadow-md"
              >
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-green-500" />
                  <span className="font-semibold text-gray-900">{ingredient.name}</span>
                </div>
                <div className="text-right">
                  {ingredient.unit && <span className="text-sm font-medium text-gray-600">{ingredient.unit}</span>}
                  {ingredient.notes && <div className="text-xs text-gray-500">{ingredient.notes}</div>}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">材料が登録されていません</p>
        )}
      </CardContent>
    </Card>
  )
}
