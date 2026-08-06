import { Routes } from '@angular/router';
import { TalentProfileDirectoryService } from './data-access';

export const profileRoutes: Routes = [
  {
    path: 'talent/:talentProfileId',
    title: 'routes.talentProfile',
    providers: [TalentProfileDirectoryService],
    loadComponent: () =>
      import('./pages/talent-profile/talent-profile').then((component) => component.TalentProfileDetail)
  },
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
