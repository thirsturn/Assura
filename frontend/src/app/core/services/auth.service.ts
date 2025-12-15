import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';

interface User {
    id: number;
    username: string;
    firstName?: string;
    lastName?: string;
    role: string;
    roleID?: number;
    divisionID?: number;
}

interface LoginResponse {
    message: string;
    token: string;
    refreshToken?: string;
    user: User;
}

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private apiUrl = 'http://localhost:3000/api/auth';
    private tokenKey = 'auth_token';
    private userKey = 'auth_user';

    // Signals for reactive state
    private currentUser = signal<User | null>(null);

    // Computed signal for user role
    userRole = computed(() => this.currentUser()?.role || null);

    constructor(private http: HttpClient, private router: Router) {
        // Load user from localStorage on init
        this.loadUserFromStorage();
    }

    private loadUserFromStorage(): void {
        const userStr = localStorage.getItem(this.userKey);
        if (userStr) {
            try {
                this.currentUser.set(JSON.parse(userStr));
            } catch (e) {
                this.currentUser.set(null);
            }
        }
    }

    updateCurrentUser(user: User): void {
        localStorage.setItem(this.userKey, JSON.stringify(user));
        this.currentUser.set(user);
    }

    login(username: string, password: string): Observable<LoginResponse> {
        return this.http.post<LoginResponse>(`${this.apiUrl}/login`, { username, password })
            .pipe(
                tap(response => {
                    if (response.token) {
                        localStorage.setItem(this.tokenKey, response.token);
                        localStorage.setItem(this.userKey, JSON.stringify(response.user));
                        this.currentUser.set(response.user);
                    }
                })
            );
    }

    logout(): void {
        localStorage.removeItem(this.tokenKey);
        localStorage.removeItem(this.userKey);
        this.currentUser.set(null);
        this.router.navigate(['/login']);
    }

    isAuthenticated(): boolean {
        const token = this.getToken();
        if (!token) {
            return false;
        }

        // Check if token is expired
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            const expiry = payload.exp * 1000;
            return Date.now() < expiry;
        } catch (e) {
            return false;
        }
    }

    getToken(): string | null {
        return localStorage.getItem(this.tokenKey);
    }

    getCurrentUser(): User | null {
        return this.currentUser();
    }

    hasRole(allowedRoles: string[]): boolean {
        const user = this.currentUser();
        if (!user || !user.role) {
            return false;
        }
        return allowedRoles.some(role =>
            role.toLowerCase() === user.role.toLowerCase()
        );
    }

    redirectByRole(role: string): void {
        const roleRoutes: { [key: string]: string } = {
            'admin': '/admin/dashboard',
            'manager': '/manager/dashboard',
            'employee': '/employee/dashboard',
            'superintendent': '/superintendent/dashboard',
            'auditor': '/auditor/dashboard',
            'accountant': '/accountant/dashboard',
            'storekeeper': '/admin/dashboard'
        };

        const route = roleRoutes[role.toLowerCase()] || '/login';
        this.router.navigate([route]);
    }
}