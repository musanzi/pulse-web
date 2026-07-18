import { Routes } from '@angular/router';
import { ApplicationMatchService, ApplicationMatchStore, TalentProfileAdapter } from './data-access';

export const applicationsRoutes: Routes = [
  {
    path: 'applications',
    title: 'routes.applications',
    providers: [ApplicationMatchService, ApplicationMatchStore, TalentProfileAdapter],
    loadComponent: () => import('./pages/applications/applications').then((component) => component.Applications)
  }
];
