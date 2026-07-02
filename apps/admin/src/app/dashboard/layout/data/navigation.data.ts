import { INavigationItem } from '@libs/utils';

export const NAVIGATION: INavigationItem[] = [
  {
    id: 'general',
    label: 'admin.navigation.general.label',
    description: 'admin.navigation.general.description',
    children: [
      {
        id: 'dashboard',
        label: 'admin.navigation.general.dashboard',
        route: '/',
        icon: 'layout-dashboard'
      },
      {
        id: 'roles',
        label: 'admin.navigation.general.roles',
        route: '/roles',
        icon: 'shield-check'
      },
      {
        id: 'users',
        label: 'admin.navigation.general.users',
        route: '/users',
        icon: 'users'
      }
    ]
  },
  {
    id: 'account',
    label: 'navigation.account.label',
    description: 'navigation.account.description',
    children: [
      {
        id: 'account-profile',
        label: 'navigation.account.info',
        route: '/account/profile',
        icon: 'user',
        activeOptions: { exact: true }
      },
      {
        id: 'account-security',
        label: 'navigation.account.security',
        route: '/account/security',
        icon: 'lock-keyhole',
        activeOptions: { exact: true }
      }
    ]
  }
];
