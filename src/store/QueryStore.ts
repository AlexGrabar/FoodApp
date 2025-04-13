import { makeAutoObservable, runInAction } from 'mobx';
import { MealType, MEAL_TYPES } from '@configs/api';
import type { Option } from '@components/MultiDropdown';

export class QueryStore {
  private _searchQuery: string = '';
  private _selectedTypes: Option[] = [];

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  get searchQuery(): string { return this._searchQuery; }
  get selectedTypes(): Option[] { return this._selectedTypes; }
  get selectedMealTypes(): MealType[] { return this._selectedTypes.map(opt => opt.key as MealType); }

  setSearchQuery(query: string): void { this._searchQuery = query; }
  setSelectedTypes(options: Option[]): void { this._selectedTypes = options; }
  setParamsFromUrl(query: string | null, typeString: string | null): void {
    const types = typeString ? typeString.split(',') as MealType[] : [];
    const validTypes = types.filter(t => MEAL_TYPES.includes(t));
    const typeOptions = validTypes.map(t => ({
      key: t,
      value: t.charAt(0).toUpperCase() + t.slice(1)
    }));
    runInAction(() => {
        this._searchQuery = query || '';
        this._selectedTypes = typeOptions;
    });
  }
}