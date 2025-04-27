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

    private saveAuthDataToStorage(): void {
        if (!this.token || !this.user) return;
        try {
            const dataToSave: AuthData = { token: this.token, user: this.user };
            localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(dataToSave));
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
                password: password || 'password123',
            };

            runInAction(() => {
                this.token = mockToken;
                this.user = mockUser;
                this.isAuthenticated = true;
            });
            this.saveAuthDataToStorage();
        } else {
            throw new Error('Email is required for login.');
        }
    }

    async register(email: string, username: string, password?: string): Promise<void> {
         console.log(`Attempting registration for: ${email}, Username: ${username}`);
         if (email && username && password) {
             await this.login(email, password);
         } else {
             throw new Error('Email, Username, and Password are required for registration.');
         }
    }

    logout(): void {
        console.log('Logging out.');
        this.clearAuthData();
    }
    async changePassword(newPassword: string): Promise<void> {
        if (!this.isAuthenticated || !this.user) {
            throw new Error('User not authenticated.');
        }
        if (!newPassword || newPassword.length < 6) {
             throw new Error('Password must be at least 6 characters long.');
        }

        console.log(`Changing password for user: ${this.user.email}`);
        await new Promise(resolve => setTimeout(resolve, 500));

        runInAction(() => {
            this.user = { ...this.user!, password: newPassword };
        });
        this.saveAuthDataToStorage();
        console.log('Password changed successfully');
    }
}