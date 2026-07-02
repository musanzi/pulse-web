import { Routes } from '@angular/router';
import { LandingLayout } from './layout/layout';

export const landingRoutes: Routes = [
  {
    path: '',
    component: LandingLayout,
    children: [
      {
        path: '',
        title: 'routes.home',
        loadComponent: () => import('./pages/home/home')
      },
      { path: '**', redirectTo: '/' }
    ]
  }
];
