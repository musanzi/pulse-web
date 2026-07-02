import { Component, inject } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatTabLink, MatTabNav, MatTabNavPanel } from '@angular/material/tabs';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { TranslocoPipe } from '@jsverse/transloco';

@Component({
  selector: 'settings-layout',
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
export class ProfileLayout {
  protected router = inject(Router);
  protected links = [
    {
      id: 'account',
      labelKey: 'profile.tabs.account',
      route: '/dashboard/account'
    },
    {
      id: 'security',
      labelKey: 'profile.tabs.security',
      route: '/dashboard/security'
    }
  ];
}
