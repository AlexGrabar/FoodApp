import { Ingredient } from './recipe';

export interface ShoppingListItem {
  id: number;
  key: string;
  name: string;
  originalString: string;
  amount: number;
  unit: string;
  recipeId: number;
  recipeTitle: string;
  added: boolean;
}