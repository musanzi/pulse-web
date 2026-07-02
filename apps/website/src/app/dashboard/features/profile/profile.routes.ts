import { Routes } from '@angular/router';

export const profileRoutes: Routes = [
  {
    path: '',
    title: 'routes.profile',
    loadComponent: () => import('./layout/layout').then((c) => c.ProfileLayout),
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'account'
      },
      {
        path: 'account',
        title: 'routes.account',
        loadComponent: () => import('./pages/account/account').then((c) => c.ProfileAccount)
      },
      {
        path: 'security',
        title: 'routes.security',
        loadComponent: () => import('./pages/security/security').then((c) => c.ProfileSecurity)
      }
    ]
  }
];
