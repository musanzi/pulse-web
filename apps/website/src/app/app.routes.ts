import { Route } from '@angular/router';
import { authGuard } from './auth/data-access';

export const routes: Route[] = [
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () => import('./dashboard/layout/layout').then((c) => c.DashboardLayout),
    loadChildren: () => import('./dashboard/dashboard.routes').then((r) => r.dashboardRoutes)
  },
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.routes').then((r) => r.authRoutes)
  },
  {
    path: '',
    loadChildren: () => import('./landing/landing.routes').then((r) => r.landingRoutes)
  }
];
