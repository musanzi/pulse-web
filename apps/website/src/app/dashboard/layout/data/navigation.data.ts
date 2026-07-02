import { INavigationItem } from '@libs/utils';

export const NAVIGATION: INavigationItem[] = [
  {
    id: 'account',
    label: 'navigation.account.label',
    description: 'navigation.account.description',
    children: [
      {
        id: 'account/info',
        label: 'navigation.account.info',
        icon: 'user',
        route: '/dashboard/account'
      },
      {
        id: 'account/security',
        label: 'navigation.account.security',
        icon: 'lock',
        route: '/dashboard/security'
      }
    ]
  }
];
