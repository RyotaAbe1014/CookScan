import { Card, CardHeader, CardContent } from '@/components/ui/card'

type Ingredient = {
  id: string
  name: string
  unit: string | null
  notes: string | null
}

type RecipeIngredientsProps = {
  ingredients: Ingredient[]
}

export function RecipeIngredients({ ingredients }: RecipeIngredientsProps) {
  return (
    <Card className="mb-8">
      <CardHeader
        icon={
          <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
            />
          </svg>
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
                className="flex items-center justify-between rounded-lg bg-gradient-to-r from-gray-50 to-white p-3 ring-1 ring-gray-200 transition-all hover:shadow-md"
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
