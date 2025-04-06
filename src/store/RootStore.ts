import { RecipeStore } from './RecipeStore';

export class RootStore {
  recipeStore: RecipeStore;

  constructor() {
    this.recipeStore = new RecipeStore();
  }
}

const rootStore = new RootStore();

export default rootStore;