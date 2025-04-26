import { QueryStore } from './QueryStore';
import { FavoritesStore } from './FavoritesStore';
import { ThemeStore } from './ThemeStore';
import { ApiStore } from './ApiStore';
import { AuthStore } from './AuthStore';
import { ShoppingListStore } from './ShoppingListStore';

export class RootStore {
  queryStore: QueryStore;
  favoritesStore: FavoritesStore;
  themeStore: ThemeStore;
  apiStore: ApiStore;
  authStore: AuthStore;
  shoppingListStore: ShoppingListStore;

  constructor() {
    this.apiStore = new ApiStore();
    this.queryStore = new QueryStore();
    this.favoritesStore = new FavoritesStore();
    this.themeStore = new ThemeStore();
    this.authStore = new AuthStore();
    this.shoppingListStore = new ShoppingListStore();
  }
}

const rootStore = new RootStore();
export default rootStore;