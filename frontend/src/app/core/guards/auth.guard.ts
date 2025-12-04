import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    if (authService.isAuthenticated()) {
        return true;
    }

    // not authorized - redirect to login
    console.log('Auth Guard: Not authenticated, redirecting to login');
    router.navigate(['/login'], { queryParams: { returnUrl: state.url} });
    return false;
};