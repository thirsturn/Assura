import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const roleGuard = (allowedRoles: string[]): CanActivateFn => {
    return () => {
        const authService = inject(AuthService);
        const router = inject(Router);

        //check if user is authenticated
        if(!authService.isAuthenticated()){
            router.navigate(['/login']);
            return false;
        }

        // check if user has allowed role
        if (authService.hasRole(allowedRoles)) {
            return true;
        }

        // redirect to user's actual dashboard
        const userRole = authService.userRole();
        if (userRole) {
            authService.redirectByRole(userRole);
        } else {
            router
        }
        return false;
    };
};