import axios, { AxiosInstance, AxiosError } from 'axios';
import { API } from '@configs/api';
import { RecipeDetails, RecipeSearchParams, RecipeSearchResult } from '@typings/recipe';

interface ApiErrorResponse {
    success: false;
    data: null;
    status?: number;
    message: string;
}

const apiKey = process.env.REACT_APP_SPOONACULAR_API_KEY;//бест практикс гуд || process.env.SPOONACULAR_API_KEY
console.log('[ApiStore] Initial API Key from process.env:', apiKey);
if (!apiKey) {
    console.warn('Warning: Seriously? Key in env');
}

export class ApiStore {
    private readonly apiClient: AxiosInstance;

    constructor() {
        console.log('[ApiStore Constructor] Using API Key:', apiKey);
        this.apiClient = axios.create({
            baseURL: API.BASE_URL,
            params: {
                apiKey: apiKey,
            },
            timeout: 10000,
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
            };
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
}