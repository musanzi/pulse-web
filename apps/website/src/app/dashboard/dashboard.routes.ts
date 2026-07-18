import { Routes } from '@angular/router';

export const dashboardRoutes: Routes = [
  {
    path: '',
    loadChildren: () => import('./features/profile/profile.routes').then((r) => r.profileRoutes)
  },
  {
    path: '',
    loadChildren: () => import('./features/peer-reviews/peer-reviews.routes').then((r) => r.peerReviewsRoutes)
  },
  {
    path: '',
    loadChildren: () => import('./features/applications/applications.routes').then((r) => r.applicationsRoutes)
  }
];
