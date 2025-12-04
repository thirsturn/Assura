import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './login.html',
    styleUrl: './login.css'
})
export class LoginComponent {
    username: string = '';
    password: string = '';
    loading: boolean = false;
    error: string = '';

    constructor(
        private authService: AuthService,
        private router: Router
    ) {
        // If already logged in, redirect to dashboard
        if (this.authService.isAuthenticated()) {
            const role = this.authService.userRole();
            if (role) {
                this.authService.redirectByRole(role);
            }
        }
    }

    onLogin(): void {
        this.error = '';

        if (!this.username || !this.password) {
            this.error = 'Please enter username and password';
            return;
        }

        this.loading = true;

        this.authService.login(this.username, this.password).subscribe({
            next: (response) => {
                console.log('Login response:', response);
                this.loading = false;
                
                // Redirect based on role
                const role = response.user?.role;
                console.log('User role:', role);
                
                if (role) {
                    this.authService.redirectByRole(role);
                } else {
                    this.router.navigate(['/admin/dashboard']);
                }
            },
            error: (err) => {
                console.error('Login error:', err);
                this.loading = false;
                this.error = err.error?.message || 'Login failed. Please try again.';
            }
        });
    }
}