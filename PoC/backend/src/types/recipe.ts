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

export interface DatabaseSchema {
  recipes: Recipe[];
}