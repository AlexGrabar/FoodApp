import { makeAutoObservable, runInAction, computed } from 'mobx';
import type { ShoppingListItem } from '@typings/shopping';
import type { Ingredient, RecipeDetails } from '@typings/recipe';

const SHOPPING_LIST_STORAGE_KEY = 'recipeAppShoppingList';

export class ShoppingListStore {
    private _itemsMap = new Map<string, ShoppingListItem>();

    constructor() {
        makeAutoObservable(this, {
            itemsList: computed,
            itemsGroupedByRecipe: computed
        }, { autoBind: true });
        this.loadListFromStorage();
    }

    private saveListToStorage(): void {
        try {
            const arrayToStore = Array.from(this._itemsMap.entries());
            localStorage.setItem(SHOPPING_LIST_STORAGE_KEY, JSON.stringify(arrayToStore));
        } catch (error) {
            console.error("Failed to save shopping list to Local Storage:", error);
        }
    }

    private loadListFromStorage(): void {
        try {
            const storedList = localStorage.getItem(SHOPPING_LIST_STORAGE_KEY);
            if (storedList) {
                const parsedArray: [string, ShoppingListItem][] = JSON.parse(storedList);
                runInAction(() => {
                    this._itemsMap = new Map(parsedArray);
                });
                console.log('Shopping list loaded from Local Storage:', this._itemsMap.size);
            }
        } catch (error) {
            console.error("Failed to load shopping list from Local Storage:", error);
        }
    }

    get itemsList(): ShoppingListItem[] {
        return Array.from(this._itemsMap.values());
    }

    get itemsGroupedByRecipe(): Map<number, { title: string; items: ShoppingListItem[] }> {
        const grouped = new Map<number, { title: string; items: ShoppingListItem[] }>();
        this.itemsList.forEach(item => {
            if (!grouped.has(item.recipeId)) {
                grouped.set(item.recipeId, { title: item.recipeTitle, items: [] });
            }
            grouped.get(item.recipeId)?.items.push(item);
        });
        return grouped;
    }

    addItem(ingredient: Ingredient, recipe: RecipeDetails): void {
        const key = `${recipe.id}-${ingredient.id}`;
        if (!this._itemsMap.has(key)) {
            const newItem: ShoppingListItem = {
                id: ingredient.id,
                key: key,
                name: ingredient.nameClean || ingredient.name,
                originalString: ingredient.original,
                amount: ingredient.amount,
                unit: ingredient.unit,
                recipeId: recipe.id,
                recipeTitle: recipe.title,
                added: false,
            };
            this._itemsMap.set(key, newItem);
            this.saveListToStorage();
            console.log(`Added item: ${newItem.name} from ${recipe.title}`);
        } else {
             console.log(`Item already in list: ${ingredient.nameClean || ingredient.name} from ${recipe.title}`);
        }
    }

    addAllItems(ingredients: Ingredient[], recipe: RecipeDetails): void {
         ingredients.forEach(ing => this.addItem(ing, recipe));
    }


    removeItem(itemKey: string): void {
        if (this._itemsMap.has(itemKey)) {
            this._itemsMap.delete(itemKey);
            this.saveListToStorage();
            console.log(`Removed item with key: ${itemKey}`);
        }
    }

    toggleItemAdded(itemKey: string): void {
        const item = this._itemsMap.get(itemKey);
        if (item) {
            item.added = !item.added;
            this._itemsMap.set(itemKey, { ...item });
            this.saveListToStorage();
        }
    }

    clearList(): void {
        if (this._itemsMap.size > 0) {
            this._itemsMap.clear();
            this.saveListToStorage();
            console.log('Shopping list cleared.');
        }
    }

     areAllIngredientsAdded(ingredients: Ingredient[], recipeId: number): boolean {
         if (ingredients.length === 0) return false;
         return ingredients.every(ing => this._itemsMap.has(`${recipeId}-${ing.id}`));
     }
}