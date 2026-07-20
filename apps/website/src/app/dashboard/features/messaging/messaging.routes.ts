import { Routes } from '@angular/router';
import { MessagingService, MessagingStore } from './data-access';

export const messagingRoutes: Routes = [
  {
    path: 'messaging',
    title: 'routes.messaging',
    providers: [MessagingService, MessagingStore],
    loadComponent: () => import('./pages/messaging/messaging').then((component) => component.Messaging)
  }
];
