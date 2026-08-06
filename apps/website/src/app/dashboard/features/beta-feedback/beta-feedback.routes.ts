import { Routes } from '@angular/router';
import { BetaFeedbackService, BetaFeedbackStore } from './data-access';

export const betaFeedbackRoutes: Routes = [
  {
    path: 'feedback',
    title: 'routes.betaFeedback',
    providers: [BetaFeedbackService, BetaFeedbackStore],
    loadComponent: () => import('./pages/beta-feedback/beta-feedback').then((component) => component.BetaFeedback)
  }
];
