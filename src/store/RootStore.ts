import { QueryStore } from './QueryStore';
import { FavoritesStore } from './FavoritesStore';
import { ThemeStore } from './ThemeStore';

export class RootStore {
  queryStore: QueryStore;
  favoritesStore: FavoritesStore;
  themeStore: ThemeStore;

  constructor() {
    this.queryStore = new QueryStore();
    this.favoritesStore = new FavoritesStore();
    this.themeStore = new ThemeStore();
  }
}

const rootStore = new RootStore();
export default rootStore;