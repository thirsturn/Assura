import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, tap } from 'rxjs';

export interface User {
        id: number;
        username: string;
        firstName: string;
        lastName: string;
        role: string;
        roleID: number;
        divisionID: number | null;
}

export interface LoginResponse {
        message: string;
        token: string;
        refreshToken: string;
        user: User
}

@Injectable({
        providedIn: 'root'
})
export class AuthService {
        private apiUrl = 'http://localhost:3000/api/auth';
        private userSignal = signal<User | null>(null);    // Update with your backend URL

        // public readable signals
        currentUser = this.userSignal.asReadonly();                    // Returns User object
        isAuthenticated = computed(() => !!this.userSignal());         // Returns boolean
        userRole = computed(() => this.userSignal()?.role ?? null); 

        constructor(private http: HttpClient, private router: Router) {
                this.loadFormStorage();
        }

        private loadFormStorage(): void {
                const userJson = localStorage.getItem('user');
                if (userJson) {
                        try {
                                this.userSignal.set(JSON.parse(userJson));
                        } catch {
                                this.clearStorage();
                        }
                }
        }

        private clearStorage(): void {
                localStorage.removeItem('token');
                localStorage.removeItem('refreshToken');
                localStorage.removeItem('user');
        }

        // login method
        login(username: string, password: string): Observable<LoginResponse> {
                return this.http.post<LoginResponse>(`${this.apiUrl}/login`, { username, password })
                        .pipe(
                                tap(res => {
                                        localStorage.setItem('token', res.token);
                                        localStorage.setItem('refreshToken', res.refreshToken);
                                        localStorage.setItem('user', JSON.stringify(res.user));
                                        this.userSignal.set(res.user);
                                        this.redirectByRole(res.user.role);
                                })
                        );
        }

        // logout method
        logout(): void {
                this.clearStorage();
                this.userSignal.set(null);
                this.router.navigate(['/login']);
        }

        // get token
        getToken(): string | null {
                return localStorage.getItem('token');
        }

        // check role
        hasRole(role: string | string[]): boolean {
                const userRole = this.userSignal()?.role?.toLowerCase();
                if (!userRole) return false;
                if (Array.isArray(role)) {
                        return role.map(r => r.toLowerCase()).includes(userRole);
                }
                return userRole === role.toLowerCase();
        }

        // redirect by role
        redirectByRole(role: string): void {
                const routs: Record<string, string> = {
                        admin: '/admin/dashboard',
                        manager: '/manager/dashboard',
                        user: '/user/dashboard',
                        storeKeeper: '/store-keeper/dashboard',
                        superintendent: '/superintendent/dashboard',
                        accountant: '/accountant/dashboard',
                        auditor: '/auditor/dashboard'
                };
                this.router.navigate([routs[role.toLowerCase()] || '/dashboard']);
        }
}

