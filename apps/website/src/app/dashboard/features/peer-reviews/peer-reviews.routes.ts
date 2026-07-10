import { Routes } from '@angular/router';

export const peerReviewsRoutes: Routes = [
  {
    path: 'peer-reviews',
    title: 'routes.peerReviews',
    loadComponent: () =>
      import('./pages/peer-reviews/peer-reviews').then((c) => c.PeerReviews)
  }
];