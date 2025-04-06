import { makeAutoObservable, runInAction } from 'mobx';
import { getRecipes, getRecipeDetails } from '@api/recipes';
import type { MealType } from '@configs/api';
import type {
  RecipeCard,
  RecipeDetails as RecipeDetailsType,
  RecipeSearchParams,
} from '@typings/recipe';
import { MEAL_TYPES } from '@configs/api';
import type { Option } from '@components/MultiDropdown';

const RECIPES_PER_PAGE = 12;
export class RecipeStore {
  recipes: RecipeCard[] = [];
  isLoadingList: boolean = false;
  errorList: string | null = null;
  offset: number = 0;
  hasMore: boolean = true;
  totalResults: number = 0;
  // TODO: UI
  currentSearchQuery: string = '';
  currentSelectedTypes: Option[] = [];
  appliedSearchQuery: string = '';
  appliedTypes: MealType[] = [];
  currentRecipe: RecipeDetailsType | null = null;
  isLoadingDetails: boolean = false;
  errorDetails: string | null = null;

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  setSearchQuery(query: string) {
    this.currentSearchQuery = query;
  }

  setSelectedTypes(options: Option[]) {
    this.currentSelectedTypes = options;
  }

  resetRecipeList() {
    this.recipes = [];
    this.offset = 0;
    this.hasMore = true;
    this.totalResults = 0;
    this.errorList = null;
  }

  applyFiltersAndLoad() {
    this.resetRecipeList();
    this.appliedSearchQuery = this.currentSearchQuery;
    this.appliedTypes = this.currentSelectedTypes.map(opt => opt.key as MealType);
    this._loadRecipes(true);
  }

  loadMoreRecipes() {
    if (!this.isLoadingList && this.hasMore) {
       this.offset += RECIPES_PER_PAGE;
       this._loadRecipes(false);
    }
  }

  private async _loadRecipes(isInitialLoad: boolean) {
    this.isLoadingList = true;
    if (isInitialLoad) {
        this.errorList = null;
    }

    const params: RecipeSearchParams = {
      query: this.appliedSearchQuery || undefined,
      type: this.appliedTypes.length > 0 ? this.appliedTypes : undefined,
      number: RECIPES_PER_PAGE,
      offset: this.offset,
    };

    try {
      const response = await getRecipes(params);
      runInAction(() => {
        if (isInitialLoad) {
          this.recipes = response.results;
        } else {
          this.recipes.push(...response.results);
        }
        this.totalResults = response.totalResults;
        this.hasMore = this.recipes.length < response.totalResults;
        this.isLoadingList = false;
      });
    } catch (err) {
      console.error('Error fetching recipes:', err);
      runInAction(() => {
        if (isInitialLoad) {
            this.errorList = 'Failed to load recipes. Please try again later.';
        }
        this.hasMore = false;
        this.isLoadingList = false;
      });
    }
  }

  async loadRecipeDetails(id: number) {
    this.isLoadingDetails = true;
    this.errorDetails = null;
    this.currentRecipe = null;
    try {
      const recipeData = await getRecipeDetails(id);
      runInAction(() => {
        this.currentRecipe = recipeData;
        this.isLoadingDetails = false;
      });
    } catch (err) {
      console.error(`Error fetching recipe details for id ${id}:`, err);
      runInAction(() => {
        this.errorDetails = 'Failed to load recipe details.';
        this.isLoadingDetails = false;
      });
    }
  }

  clearRecipeDetails() {
    this.currentRecipe = null;
    this.isLoadingDetails = false;
    this.errorDetails = null;
  }

  initializeFromUrlParams(query: string | null, typeString: string | null) {
     const types = typeString ? typeString.split(',') as MealType[] : [];
     const typeOptions = types
        .map(t => ({ key: t, value: t.charAt(0).toUpperCase() + t.slice(1) }))
        .filter(opt => MEAL_TYPES.includes(opt.key as MealType));
     this.appliedSearchQuery = query || '';
     this.appliedTypes = types;
     this.currentSearchQuery = query || '';
     this.currentSelectedTypes = typeOptions;
     this.resetRecipeList();
     this._loadRecipes(true);
  }
}