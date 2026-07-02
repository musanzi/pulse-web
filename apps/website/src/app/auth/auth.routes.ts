import { Routes } from '@angular/router';
import { unauthGuard } from './data-access';

export const authRoutes: Routes = [
  {
    path: '',
    canActivate: [unauthGuard],
    title: 'routes.auth',
    loadComponent: () => import('./layout/layout').then((c) => c.AuthLayout),
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'sign-in'
      },
      {
        path: 'forgot-password',
        title: 'routes.forgotPassword',
        loadComponent: () => import('./pages/forgot-password/forgot-password').then((c) => c.AuthForgotPassword)
      },
      {
        path: 'forgot-password/sent',
        title: 'routes.forgotPasswordSent',
        loadComponent: () =>
          import('./pages/forgot-password-sent/forgot-password-sent').then((c) => c.AuthForgotPasswordSent)
      },
      {
        path: 'reset-password',
        title: 'routes.resetPassword',
        loadComponent: () => import('./pages/reset-password/reset-password').then((c) => c.AuthResetPassword)
      },
      {
        path: 'sign-in',
        title: 'routes.signIn',
        loadComponent: () => import('./pages/sign-in/sign-in').then((c) => c.AuthSignIn)
      },
      {
        path: 'sign-up',
        title: 'routes.signUp',
        loadComponent: () => import('./pages/sign-up/sign-up').then((c) => c.AuthSignUp)
      },
      {
        path: 'profile',
        pathMatch: 'full',
        redirectTo: '/dashboard'
      },
      {
        path: 'profile',
        children: [
          {
            path: 'account',
            redirectTo: '/dashboard/account'
          },
          {
            path: 'security',
            redirectTo: '/dashboard/security'
          }
        ]
      }
    ]
  }
];
