import { Routes } from '@angular/router';

export const accountRoutes: Routes = [
  {
    path: '',
    title: 'routes.account',
    loadComponent: () => import('./layout/layout').then((c) => c.AccountLayout),
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'profile'
      },
      {
        path: 'profile',
        title: 'routes.profile',
        loadComponent: () => import('./pages/profile/profile').then((c) => c.AccountProfile)
      },
      {
        path: 'security',
        title: 'routes.security',
        loadComponent: () => import('./pages/security/security').then((c) => c.AccountSecurity)
      }
    ]
  }
];
