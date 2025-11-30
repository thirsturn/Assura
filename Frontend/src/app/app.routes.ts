import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./modules/dashboard/asset-dashboard/asset-dashboard.component')
      .then(m => m.AssetDashboardComponent)
  }
  // Add other routes here
];