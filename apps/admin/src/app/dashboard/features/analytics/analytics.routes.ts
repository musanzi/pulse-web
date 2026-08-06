import { Routes } from '@angular/router';
import { AdminAnalyticsService, AdminAnalyticsStore } from './data-access';

export const analyticsRoutes: Routes = [
  {
    path: 'analytics',
    title: 'admin.routes.analytics',
    providers: [AdminAnalyticsService, AdminAnalyticsStore],
    loadComponent: () => import('./pages/analytics/analytics').then((component) => component.Analytics)
  }
];
