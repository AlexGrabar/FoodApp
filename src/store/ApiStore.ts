import axios, { AxiosInstance, AxiosError } from 'axios';
import { API } from '@configs/api';
import { RecipeDetails, RecipeSearchParams, RecipeSearchResult, RecipeCard } from '@typings/recipe';

interface ApiErrorResponse {
    success: false;
    data: null;
    status?: number;
    message: string;
}

interface RandomRecipeResponse {
    recipes: RecipeDetails[];
}

const apiKey = process.env.REACT_APP_SPOONACULAR_API_KEY;

export class ApiStore {
    private readonly apiClient: AxiosInstance;

    constructor() {
        this.apiClient = axios.create({
            baseURL: API.BASE_URL,
            params: {
                apiKey: apiKey,
            },
            timeout: 15000,
        });
    }

    private _handleError(error: unknown): ApiErrorResponse {
        if (axios.isAxiosError(error)) {
            const axiosError = error as AxiosError;
            console.error("API Error:", axiosError.response?.status, axiosError.message, axiosError.config?.url);
            let serverMessage: string | undefined = undefined;
            if (axiosError.response?.data &&
                typeof axiosError.response.data === 'object' &&
                'message' in axiosError.response.data &&
                typeof (axiosError.response.data as any).message === 'string') {
                serverMessage = (axiosError.response.data as any).message;
            }

            if (axiosError.response?.status === 402) {
                 serverMessage = 'API request limit reached for today. Please try again tomorrow.';
            }


            return {
                success: false,
                data: null,
                status: axiosError.response?.status,
                message: serverMessage || axiosError.message || 'An API error occurred',
            };
        } else {
            console.error("Unexpected Error:", error);
            return {
                success: false,
                data: null,
                message: error instanceof Error ? error.message : 'An unexpected error occurred',
            };
        }
    }

    async getRecipes(params: RecipeSearchParams = {}): Promise<RecipeSearchResult> {
        try {
            const apiParams = {
                ...params,
                type: Array.isArray(params.type) ? params.type.join(',') : params.type,
                cuisine: Array.isArray(params.cuisine) ? params.cuisine.join(',') : params.cuisine,
                intolerances: Array.isArray(params.intolerances) ? params.intolerances.join(',') : params.intolerances,
            };
            Object.keys(apiParams).forEach(key => (apiParams as any)[key] == null && delete (apiParams as any)[key]);

            const response = await this.apiClient.get<RecipeSearchResult>(API.ENDPOINTS.RECIPES, {
                params: apiParams,
            });
            return response.data;
        } catch (error) {
            const errorResponse = this._handleError(error);
            throw new Error(errorResponse.message);
        }
    }

    async getRecipeDetails(id: number): Promise<RecipeDetails> {
         try {
            const response = await this.apiClient.get<RecipeDetails>(API.ENDPOINTS.RECIPE_DETAILS(id));
            return response.data;
        } catch (error) {
            const errorResponse = this._handleError(error);
            throw new Error(errorResponse.message);
        }
    }

    async getRandomRecipes(tags?: string[]): Promise<RecipeDetails[]> {
        try {
            const params: { number: number; tags?: string } = { number: 1 };
            if (tags && tags.length > 0) {
                params.tags = tags.join(',');
            }
            const response = await this.apiClient.get<RandomRecipeResponse>(API.ENDPOINTS.RANDOM_RECIPES, { params });
            if (!response.data || !response.data.recipes) {
                 throw new Error('Invalid response format for random recipes.');
            }
            return response.data.recipes;
        } catch (error) {
             const errorResponse = this._handleError(error);
             throw new Error(errorResponse.message);
        }
    }
}