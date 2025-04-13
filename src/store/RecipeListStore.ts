import { makeAutoObservable } from 'mobx';
import { getRecipes } from '@api/recipes';
import type { RecipeCard, RecipeSearchParams } from '@typings/recipe';
import { CollectionStore } from './CollectionStore';

const RECIPES_PER_PAGE = 12;

export type RecipeListExternalParams = Omit<RecipeSearchParams, 'offset' | 'number'>;

export class RecipeListStore {
  private readonly _collection: CollectionStore<RecipeCard, RecipeListExternalParams>;

  constructor() {
    this._collection = new CollectionStore(getRecipes, RECIPES_PER_PAGE);
    makeAutoObservable(this, {}, { autoBind: true });
  }

  get recipes(): RecipeCard[] { return this._collection.list; }
  get isLoading(): boolean { return this._collection.isLoading; }
  get isInitialLoading(): boolean { return this._collection.isInitialLoading; }
  get error(): string | null { return this._collection.error; }
  get hasMore(): boolean { return this._collection.hasMore; }
  get totalResults(): number { return this._collection.totalResults; }
  get isEmpty(): boolean { return this._collection.isEmpty; }
  get isListEmptyAndNotLoading(): boolean { return this._collection.isListEmptyAndNotLoading; }

  async loadInitialRecipes(params: RecipeListExternalParams): Promise<void> {
    await this._collection.loadInitial(params);
  }

  async loadMoreRecipes(): Promise<void> {
    await this._collection.loadMore();
  }

  reset(): void {
    this._collection.reset();
  }
}