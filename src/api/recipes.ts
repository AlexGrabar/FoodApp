import axios from 'axios';
import { API } from '@configs/api';
import { RecipeDetails, RecipeSearchParams, RecipeSearchResult } from '@typings/recipe';

const apiClient = axios.create({
  baseURL: API.BASE_URL,
  params: {
    apiKey: API.API_KEY,
  },
});

export const getRecipes = async (params: RecipeSearchParams = {}): Promise<RecipeSearchResult> => {
  try {
    const response = await apiClient.get(API.ENDPOINTS.RECIPES, {
      params: {
        ...params,
        type: Array.isArray(params.type) ? params.type.join(',') : params.type,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching recipes:', error);
    throw error;
  }
};

export const getRecipeDetails = async (id: number): Promise<RecipeDetails> => {
  try {
    const response = await apiClient.get(API.ENDPOINTS.RECIPE_DETAILS(id));
    return response.data;
  } catch (error) {
    console.error(`Error fetching recipe details for id ${id}:`, error);
    throw error;
  }
};