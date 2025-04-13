import { makeAutoObservable, reaction, runInAction } from 'mobx';

type Theme = 'light' | 'dark';
const THEME_STORAGE_KEY = 'recipeAppTheme';

export class ThemeStore {
    theme: Theme = 'light';

    constructor() {
        makeAutoObservable(this, {}, { autoBind: true });
        this._loadThemeFromStorage();
        this._initThemeReaction();
    }

    private _loadThemeFromStorage(): void {
        try {
            const storedTheme = localStorage.getItem(THEME_STORAGE_KEY);
            if (storedTheme === 'light' || storedTheme === 'dark') {
                 runInAction(() => {
                     this.theme = storedTheme;
                 });
                console.log(`Theme loaded from Local Storage: ${this.theme}`);
            } else {
                this._checkSystemPreference();
            }
        } catch (error) {
            console.error("Failed to load theme from Local Storage:", error);
        }
    }

     private _checkSystemPreference(): void {
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
             runInAction(() => {
                 this.theme = 'dark';
             });
            console.log('Setting theme based on system preference: dark');
        }
    }

    private _saveThemeToStorage(): void {
        try {
            localStorage.setItem(THEME_STORAGE_KEY, this.theme);
        } catch (error) {
            console.error("Failed to save theme to Local Storage:", error);
        }
    }

    private _initThemeReaction(): void {
        reaction(
            () => this.theme,
            (newTheme, previousTheme) => {
                console.log(`Theme changed from ${previousTheme} to ${newTheme}. Updating body class.`);
                if (previousTheme) {
                    document.body.classList.remove(previousTheme);
                }
                document.body.classList.add(newTheme);
                this._saveThemeToStorage();
            },
            { fireImmediately: true }
        );
    }

    toggleTheme(): void {
        this.theme = this.theme === 'light' ? 'dark' : 'light';
        console.log(`Theme toggled to: ${this.theme}`);
    }
}