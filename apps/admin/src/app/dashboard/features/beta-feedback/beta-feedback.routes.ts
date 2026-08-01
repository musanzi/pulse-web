import { Routes } from '@angular/router';
import { BetaFeedbackLogService, BetaFeedbackLogStore } from './data-access';

export const betaFeedbackRoutes: Routes = [
  {
    path: 'beta-feedback',
    title: 'admin.routes.betaFeedback',
    providers: [BetaFeedbackLogService, BetaFeedbackLogStore],
    loadComponent: () =>
      import('./pages/beta-feedback-log/beta-feedback-log').then((component) => component.BetaFeedbackLog)
  }
];
