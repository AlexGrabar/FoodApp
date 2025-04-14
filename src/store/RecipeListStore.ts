import { makeAutoObservable, observable } from 'mobx';
import type { RecipeCard, RecipeSearchParams } from '@typings/recipe';
import { CollectionStore } from './CollectionStore';
import rootStore from './RootStore';

export type RecipeListExternalParams = Omit<RecipeSearchParams, 'offset' | 'number'>;

export class RecipeListStore {
    readonly collection: CollectionStore<RecipeCard, RecipeListExternalParams>;
    constructor() {
      this.collection = new CollectionStore(
          rootStore.apiStore.getRecipes.bind(rootStore.apiStore),
          12
      );

      makeAutoObservable(this, {
          collection: observable,
      }, { autoBind: true });
  }

    get recipes(): RecipeCard[] { return this.collection.list; }
    get isLoading(): boolean { return this.collection.isLoading; }
    get isInitialLoading(): boolean { return this.collection.isInitialLoading; }
    get error(): string | null { return this.collection.error; }
    get hasMore(): boolean { return this.collection.hasMore; }
    get totalResults(): number { return this.collection.totalResults; }
    get isEmpty(): boolean { return this.collection.isEmpty; }
    get isListEmptyAndNotLoading(): boolean { return this.collection.isListEmptyAndNotLoading; }

    async loadInitialRecipes(params: RecipeListExternalParams): Promise<void> {
        console.log('RecipeListStore: loadInitialRecipes called with:', params);
        await this.collection.loadInitial(params);
    }

    async loadMoreRecipes(): Promise<void> {
        await this.collection.loadMore();
    }

    reset(): void {
        this.collection.reset();
    }

    destroy(): void {
        this.collection.destroy();
    }
}