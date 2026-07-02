import { Route } from '@angular/router';

export const dashboardRoutes: Route[] = [
  {
    path: '',
    title: 'admin.routes.stats',
    loadComponent: () => import('./features/stats/pages/stats/stats').then((c) => c.Stats)
  },
  {
    path: 'roles',
    title: 'admin.routes.roles',
    loadComponent: () => import('./features/roles/pages/roles/roles').then((c) => c.Roles)
  },
  {
    path: 'users',
    title: 'admin.routes.users',
    loadComponent: () => import('./features/users/pages/users/users').then((c) => c.Users)
  },
  {
    path: 'account',
    title: 'routes.account',
    loadChildren: () => import('./features/account/account.routes').then((r) => r.accountRoutes)
  }
];
