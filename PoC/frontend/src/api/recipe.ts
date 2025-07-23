import type { ExtractRecipeResponse, Recipe, RecipeWithoutMeta, ApiResponse } from '../types/recipe';

const API_BASE_URL = 'http://localhost:3001';

export const extractRecipe = async (file: File, save: boolean = false): Promise<ExtractRecipeResponse> => {
  try {
    const formData = new FormData();
    formData.append('image', file);

    const response = await fetch(`${API_BASE_URL}/api/recipes/extract?save=${save}`, {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.error || 'レシピの抽出に失敗しました',
      };
    }

    return data;
  } catch (error) {
    console.error('API request failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'ネットワークエラーが発生しました',
    };
  }
};

export const getAllRecipes = async (): Promise<ApiResponse<Recipe>> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/recipes`, {
      method: 'GET',
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.error || 'レシピの取得に失敗しました',
      };
    }

    return data;
  } catch (error) {
    console.error('API request failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'ネットワークエラーが発生しました',
    };
  }
};

export const getRecipeById = async (id: string): Promise<ApiResponse<Recipe>> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/recipes/${id}`, {
      method: 'GET',
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.error || 'レシピの取得に失敗しました',
      };
    }

    return data;
  } catch (error) {
    console.error('API request failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'ネットワークエラーが発生しました',
    };
  }
};

export const createRecipe = async (recipe: RecipeWithoutMeta): Promise<ApiResponse<Recipe>> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/recipes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(recipe),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.error || 'レシピの作成に失敗しました',
      };
    }

    return data;
  } catch (error) {
    console.error('API request failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'ネットワークエラーが発生しました',
    };
  }
};

export const updateRecipe = async (id: string, recipe: Partial<RecipeWithoutMeta>): Promise<ApiResponse<Recipe>> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/recipes/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(recipe),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.error || 'レシピの更新に失敗しました',
      };
    }

    return data;
  } catch (error) {
    console.error('API request failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'ネットワークエラーが発生しました',
    };
  }
};

export const deleteRecipe = async (id: string): Promise<ApiResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/recipes/${id}`, {
      method: 'DELETE',
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.error || 'レシピの削除に失敗しました',
      };
    }

    return data;
  } catch (error) {
    console.error('API request failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'ネットワークエラーが発生しました',
    };
  }
};