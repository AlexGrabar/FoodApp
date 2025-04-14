import { makeAutoObservable, runInAction, observable, IObservableValue } from 'mobx';
import rootStore from './RootStore';
import type { RecipeDetails as RecipeDetailsType } from '@typings/recipe';

export class RecipeDetailsStore {
    private readonly _recipeBox: IObservableValue<RecipeDetailsType | null>;
    private _isLoading: boolean = false;
    private _error: string | null = null;
    private _currentId: number | null = null;

    constructor() {
        this._recipeBox = observable.box<RecipeDetailsType | null>(null, { deep: false });
        makeAutoObservable(this, {}, { autoBind: true });
    }

    private get _recipe(): RecipeDetailsType | null { return this._recipeBox.get(); }
    private set _recipe(value: RecipeDetailsType | null) { this._recipeBox.set(value); }

    get recipe(): RecipeDetailsType | null { return this._recipe; }
    get isLoading(): boolean { return this._isLoading; }
    get error(): string | null { return this._error; }

    async loadRecipeDetails(id: number): Promise<void> {
        if (id === this._currentId || this._isLoading) return;

        this._isLoading = true;
        this._error = null;
        this._recipe = null;
        this._currentId = id;

        try {
            const recipeData = await rootStore.apiStore.getRecipeDetails(id);
            runInAction(() => {
                if (this._currentId === id) { this._recipe = recipeData; }
            });
        } catch (err: unknown) {
            let errorMessage = 'Failed to load recipe details.';
            if (err instanceof Error) { errorMessage = err.message; }
            runInAction(() => {
                if (this._currentId === id) {
                    this._error = errorMessage;
                    this._currentId = null;
                }
            });
        } finally {
            runInAction(() => {
                if (this._currentId === id) { this._isLoading = false; }
            });
        }
    }

     destroy(): void {
     }

    clearRecipeDetails(): void {
        runInAction(() => {
            this._recipe = null;
            this._isLoading = false;
            this._error = null;
            this._currentId = null;
        });
    }

    setError(errorMessage: string): void {
        runInAction(() => {
            this._error = errorMessage;
            this._isLoading = false;
            this._recipe = null;
            this._currentId = null;
        })
    }
}