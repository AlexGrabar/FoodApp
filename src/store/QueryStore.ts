import { makeAutoObservable, runInAction } from 'mobx';
import { MealType, MEAL_TYPES, RecipeSortOption, SORT_OPTIONS } from '@configs/api';
import type { Option } from '@components/MultiDropdown';

export class QueryStore {
  private _searchQuery: string = '';
  private _selectedTypes: Option[] = [];
  private _selectedSort: RecipeSortOption | null = null;
  private _selectedDiets: Option[] = [];
  private _selectedCuisines: Option[] = [];

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  get searchQuery(): string { return this._searchQuery; }
  get selectedTypes(): Option[] { return this._selectedTypes; }
  get selectedSort(): RecipeSortOption | null { return this._selectedSort; }
  get selectedDiets(): Option[] { return this._selectedDiets; }
  get selectedCuisines(): Option[] { return this._selectedCuisines; }
  get selectedMealTypes(): MealType[] { return this._selectedTypes.map(opt => opt.key as MealType); }
  get selectedDietKeys(): string[] { return this._selectedDiets.map(opt => opt.key); }
  get selectedCuisineKeys(): string[] { return this._selectedCuisines.map(opt => opt.key); }

  setSearchQuery(query: string): void { this._searchQuery = query; }
  setSelectedTypes(options: Option[]): void { this._selectedTypes = options; }
  setSelectedSort(sortKey: RecipeSortOption | null): void { this._selectedSort = sortKey; }
  setSelectedDiets(options: Option[]): void { this._selectedDiets = options; }
  setSelectedCuisines(options: Option[]): void { this._selectedCuisines = options; }
  setParamsFromUrlIfNeeded(params: URLSearchParams): boolean {
    const newQuery = params.get('query') || '';
    const typeString = params.get('type') || '';
    const sortString = params.get('sort') as RecipeSortOption | null;
    const dietString = params.get('diet') || '';
    const cuisineString = params.get('cuisine') || '';
    const types = typeString ? typeString.split(',') as MealType[] : [];
    const validTypes = types.filter(t => MEAL_TYPES.includes(t));
    const newTypeOptions: Option[] = validTypes.map(t => ({ key: t, value: t.charAt(0).toUpperCase() + t.slice(1) }));
    const diets = dietString ? dietString.split(',') : [];
    const newDietOptions: Option[] = diets.map(d => ({ key: d, value: d }));
    const cuisines = cuisineString ? cuisineString.split(',') : [];
    const newCuisineOptions: Option[] = cuisines.map(c => ({ key: c, value: c }));
    const newSort = SORT_OPTIONS.some(s => s.key === sortString) ? sortString : null;
    const queryChanged = this._searchQuery !== newQuery;
    const typesChanged = this._optionsChanged(this._selectedTypes, newTypeOptions);
    const sortChanged = this._selectedSort !== newSort;
    const dietsChanged = this._optionsChanged(this._selectedDiets, newDietOptions);
    const cuisinesChanged = this._optionsChanged(this._selectedCuisines, newCuisineOptions);

    const hasChanged = queryChanged || typesChanged || sortChanged || dietsChanged || cuisinesChanged;

    if (hasChanged) {
      runInAction(() => {
          this._searchQuery = newQuery;
          this._selectedTypes = newTypeOptions;
          this._selectedSort = newSort;
          this._selectedDiets = newDietOptions;
          this._selectedCuisines = newCuisineOptions;
      });
    }
    return hasChanged;
  }

  private _optionsChanged(currentOptions: Option[], newOptions: Option[]): boolean {
      if (currentOptions.length !== newOptions.length) return true;
      const currentKeys = new Set(currentOptions.map(o => o.key));
      return !newOptions.every(newOpt => currentKeys.has(newOpt.key));
  }
}