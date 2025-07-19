import type { ExtractRecipeResponse } from '../types/recipe';

const API_BASE_URL = 'http://localhost:3001';

export const extractRecipe = async (file: File): Promise<ExtractRecipeResponse> => {
  try {
    const formData = new FormData();
    formData.append('image', file);

    const response = await fetch(`${API_BASE_URL}/api/recipes/extract`, {
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