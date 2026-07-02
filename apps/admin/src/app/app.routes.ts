import { Route } from '@angular/router';
import { authGuard, lockedGuard } from './auth/data-access';

export const routes: Route[] = [
  {
    path: 'locked',
    canActivate: [lockedGuard],
    title: 'admin.routes.locked',
    loadComponent: () => import('./locked/locked').then((c) => c.Locked)
  },
  {
    path: 'auth',
    title: 'admin.routes.auth',
    loadChildren: () => import('./auth/auth.routes').then((r) => r.authRoutes)
  },
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () => import('./dashboard/layout/layout').then((c) => c.AdminLayout),
    loadChildren: () => import('./dashboard/dashboard.routes').then((r) => r.dashboardRoutes)
  },
  { path: '**', redirectTo: '/' }
];
