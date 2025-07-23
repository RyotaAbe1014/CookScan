export interface Ingredient {
  name: string;
  quantity: string;
}

export interface Recipe {
  id: string;
  title: string;
  ingredients: Ingredient[];
  steps: string[];
  memo?: string;
  createdAt: string;
  updatedAt: string;
}

export interface RecipeWithoutMeta {
  title: string;
  ingredients: Ingredient[];
  steps: string[];
  memo?: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  recipe?: T;
  recipes?: T[];
  error?: string;
  message?: string;
}

export interface ExtractRecipeResponse {
  success: boolean;
  recipe?: Recipe;
  error?: string;
}