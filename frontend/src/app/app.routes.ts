import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login';
import { AdminComponent } from './pages/admin/admin';
import { DashboardComponent } from './pages/admin/dashboard/dashboard';
import { AllAssetsComponent } from './pages/admin/allAssets/allAssets';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';
import { UserMngComponent as User } from './pages/admin/userMng/userMng';

export const routes: Routes = [
    // {
    //     path: 'login',
    //     component: LoginComponent
    // },
    {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
    },

    // login page - no guard needed
    {
        path: 'login',
        loadComponent: () => import('./pages/login/login').then(m => m.LoginComponent)
    },

    // admin routes - Protected with guards
    {
        path: 'admin',
        loadComponent: () => import('./pages/admin/admin').then(m => m.AdminComponent),
        canActivate: [authGuard], // blocks the unauthorized access
        data: { roles: ['Admin'] },
        children: [
            {
                path: 'dashboard',
                component: DashboardComponent
            },
            {
                path: 'all-assets',
                component: AllAssetsComponent
            },
            {
                path: 'user-mng',
                component: User
            },
            {
                path: '',
                redirectTo: 'dashboard',
                pathMatch: 'full'
            }
        ]
    },
    
    {
        path: 'profile',
        loadComponent: () => import('./pages/profile/profile').then(m => m.ProfileComponent),
    }
];

export const appRoutingProviders: any[] = [];