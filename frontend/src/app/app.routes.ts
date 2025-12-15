import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login';
import { AdminComponent } from './pages/admin/admin';
import { DashboardComponent } from './pages/admin/dashboard/dashboard';
import { AllAssetsComponent } from './pages/admin/allAssets/allAssets';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';
import { UserMngComponent as User } from './pages/admin/userMng/userMng';
import { ProfileComponent } from './pages/admin/profile/profile';
import { MsgComponent } from './pages/admin/messages/messages';
import { AssetListComponent } from './pages/storeKeeper/asset-list/asset-list.component';
import { AssetFormComponent } from './pages/storeKeeper/asset-form/asset-form.component';
import { AssetDetailComponent } from './pages/storeKeeper/asset-detail/asset-detail.component';

export const routes: Routes = [
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
        data: { roles: ['Admin', 'StoreKeeper'] },
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
                component: User,
                canActivate: [roleGuard],
                data: { roles: ['Admin'] } // Only Admin can see user management
            },
            {
                path: 'profile',
                component: ProfileComponent
            },
            {
                path: 'messages',
                component: MsgComponent
            },
            {
                path: 'manage-assets',
                component: AssetListComponent
            },
            {
                path: 'manage-assets/new',
                component: AssetFormComponent
            },
            {
                path: 'manage-assets/:id',
                component: AssetDetailComponent
            },
            {
                path: 'manage-assets/:id/edit',
                component: AssetFormComponent
            },
            {
                path: '',
                redirectTo: 'dashboard',
                pathMatch: 'full'
            }
        ]
    }
];

export const appRoutingProviders: any[] = [];