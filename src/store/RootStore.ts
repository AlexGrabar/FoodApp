import { QueryStore } from './QueryStore';
import { FavoritesStore } from './FavoritesStore';
import { ThemeStore } from './ThemeStore';
import { ApiStore } from './ApiStore';

export class RootStore {
  queryStore: QueryStore;
  favoritesStore: FavoritesStore;
  themeStore: ThemeStore;
  apiStore: ApiStore;

  constructor() {
    this.queryStore = new QueryStore();
    this.favoritesStore = new FavoritesStore();
    this.themeStore = new ThemeStore();
    this.apiStore = new ApiStore();
  }
}

const rootStore = new RootStore();
export default rootStore;