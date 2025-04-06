import { MealType } from '@configs/api';

// Интерфейс для карточки рецепта
export interface RecipeCard {
  id: number;
  title: string;
  image: string;
  imageType: string;
}

// Интерфейс для результатов поиска рецептов
export interface RecipeSearchResult {
  results: RecipeCard[];
  offset: number;
  number: number;
  totalResults: number;
}

// Интерфейс для детальной информации о рецепте
export interface RecipeDetails {
  id: number;
  title: string;
  image: string;
  servings: number;
  readyInMinutes: number;
  sourceName: string;
  sourceUrl: string;
  spoonacularScore: number;
  healthScore: number;
  pricePerServing: number;
  vegetarian: boolean;
  vegan: boolean;
  glutenFree: boolean;
  dairyFree: boolean;
  veryHealthy: boolean;
  cheap: boolean;
  veryPopular: boolean;
  dishTypes: string[];
  extendedIngredients: Ingredient[];
  summary: string;
  instructions: string;
  analyzedInstructions: AnalyzedInstruction[];
}

// Интерфейс для ингредиента
export interface Ingredient {
  id: number;
  aisle: string;
  image: string;
  consistency: string;
  name: string;
  nameClean: string;
  original: string;
  originalName: string;
  amount: number;
  unit: string;
  meta: string[];
  measures: {
    us: {
      amount: number;
      unitShort: string;
      unitLong: string;
    };
    metric: {
      amount: number;
      unitShort: string;
      unitLong: string;
    };
  };
}

// Интерфейс для проанализированных инструкций
export interface AnalyzedInstruction {
  name: string;
  steps: {
    number: number;
    step: string;
    ingredients: {
      id: number;
      name: string;
      localizedName: string;
      image: string;
    }[];
    equipment: {
      id: number;
      name: string;
      localizedName: string;
      image: string;
    }[];
    length?: {
      number: number;
      unit: string;
    };
  }[];
}

// Интерфейс для параметров поиска рецептов
export interface RecipeSearchParams {
  query?: string;
  type?: MealType | MealType[];
  number?: number;
  offset?: number;
  addRecipeNutrition?: boolean;
}