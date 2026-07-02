import { Component, inject } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatTabLink, MatTabNav, MatTabNavPanel } from '@angular/material/tabs';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { TranslocoPipe } from '@jsverse/transloco';

@Component({
  selector: 'admin-account-layout',
  imports: [
    RouterOutlet,
    MatTabNav,
    MatTabLink,
    MatTabNavPanel,
    RouterLink,
    RouterLinkActive,
    MatFormFieldModule,
    MatSelectModule,
    TranslocoPipe
  ],
  templateUrl: './layout.html'
})
export class AccountLayout {
  protected readonly router = inject(Router);
  protected readonly links = [
    {
      id: 'profile',
      labelKey: 'profile.tabs.account',
      route: '/account/profile'
    },
    {
      id: 'security',
      labelKey: 'profile.tabs.security',
      route: '/account/security'
    }
  ];
}
