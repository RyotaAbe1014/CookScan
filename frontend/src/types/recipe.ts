export interface Ingredient {
  name: string;
  quantity: string;
}

export interface Recipe {
  title: string;
  ingredients: Ingredient[];
  steps: string[];
  memo?: string;
}

export interface ExtractRecipeResponse {
  success: boolean;
  recipe?: Recipe;
  error?: string;
}