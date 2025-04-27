import { makeAutoObservable, runInAction } from 'mobx';
import type { UserProfile } from '@typings/user';

const AUTH_STORAGE_KEY = 'recipeAppAuth';

interface AuthData {
    token: string;
    user: UserProfile;
}

export class AuthStore {
    isAuthenticated: boolean = false;
    user: UserProfile | null = null;
    token: string | null = null;
    isLoading: boolean = true;

    constructor() {
        makeAutoObservable(this, {}, { autoBind: true });
        this.loadAuthDataFromStorage();
    }

    private saveAuthDataToStorage(data: AuthData): void {
        try {
            localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(data));
        } catch (error) {
            console.error("Failed to save auth data to Local Storage:", error);
        }
    }

    private loadAuthDataFromStorage(): void {
        try {
            const storedData = localStorage.getItem(AUTH_STORAGE_KEY);
            if (storedData) {
                const parsedData: AuthData = JSON.parse(storedData);
                if (parsedData.token && parsedData.user) {
                    runInAction(() => {
                        this.token = parsedData.token;
                        this.user = parsedData.user;
                        this.isAuthenticated = true;
                    });
                    console.log('Auth data loaded from Local Storage.');
                } else {
                     this.clearAuthData();
                }
            }
        } catch (error) {
            console.error("Failed to load auth data from Local Storage:", error);
             this.clearAuthData();
        } finally {
             runInAction(() => {
                this.isLoading = false;
             });
        }
    }

    private clearAuthData(): void {
         runInAction(() => {
             this.isAuthenticated = false;
             this.user = null;
             this.token = null;
         });
        try {
            localStorage.removeItem(AUTH_STORAGE_KEY);
        } catch (error) {
            console.error("Failed to remove auth data from Local Storage:", error);
        }
    }

    async login(email: string, password?: string): Promise<void> {
        console.log(`Attempting login for: ${email}`);
        if (email) {
            const mockToken = `fake-token-${Date.now()}`;
            const mockUser: UserProfile = {
                id: email,
                username: email.split('@')[0],
                email: email,
            };
            const authData: AuthData = { token: mockToken, user: mockUser };

            runInAction(() => {
                this.token = authData.token;
                this.user = authData.user;
                this.isAuthenticated = true;
            });
            this.saveAuthDataToStorage(authData);
        } else {
            throw new Error('Email is required for login.');
        }
    }

    async register(email: string, username: string, password?: string): Promise<void> {
         console.log(`Attempting registration for: ${email}, Username: ${username}`);
         if (email && username) {
             await this.login(email);
         } else {
             throw new Error('Email and Username are required for registration.');
         }
    }

    logout(): void {
        console.log('Logging out.');
        this.clearAuthData();
    }
}