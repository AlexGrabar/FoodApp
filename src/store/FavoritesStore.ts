import { makeAutoObservable, runInAction, computed } from 'mobx';
import type { RecipeCard } from '@typings/recipe';

const FAVORITES_STORAGE_KEY = 'recipeAppFavorites';

export class FavoritesStore {
    private _favoritesMap = new Map<number, RecipeCard>();

    constructor() {
        makeAutoObservable(this, {
            favoritesList: computed,
        }, { autoBind: true });
        this._loadFavoritesFromStorage();
    }

    private _loadFavoritesFromStorage(): void {
        try {
            const storedFavorites = localStorage.getItem(FAVORITES_STORAGE_KEY);
            if (storedFavorites) {
                const parsedArray: [number, RecipeCard][] = JSON.parse(storedFavorites);
                runInAction(() => {
                    this._favoritesMap = new Map(parsedArray);
                });
                console.log('Favorites loaded from Local Storage:', this._favoritesMap.size);
            }
        } catch (error) {
            console.error("Failed to load favorites from Local Storage:", error);
        }
    }

    private _saveFavoritesToStorage(): void {
        try {
            const arrayToStore = Array.from(this._favoritesMap.entries());
            localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(arrayToStore));
        } catch (error) {
            console.error("Failed to save favorites to Local Storage:", error);
        }
    }

    get favoritesList(): RecipeCard[] {
        return Array.from(this._favoritesMap.values());
    }

    isFavorite(id: number): boolean {
        return this._favoritesMap.has(id);
    }

    addFavorite(recipe: RecipeCard): void {
        if (!this.isFavorite(recipe.id)) {
            this._favoritesMap.set(recipe.id, recipe);
            this._saveFavoritesToStorage();
        }
    }

    removeFavorite(id: number): void {
        if (this.isFavorite(id)) {
            this._favoritesMap.delete(id);
            this._saveFavoritesToStorage();
        }
    }

    toggleFavorite(recipe: RecipeCard): void {
        if (this.isFavorite(recipe.id)) {
            this.removeFavorite(recipe.id);
        } else {
            this.addFavorite(recipe);
        }
    }
}