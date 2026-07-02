import { Component, computed, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenav, MatSidenavContainer, MatSidenavContent } from '@angular/material/sidenav';
import { RouterOutlet } from '@angular/router';
import { TranslocoPipe } from '@jsverse/transloco';
import { Media } from '@libs/core';
import { LanguageSwitcher, SchemeSwitcher } from '@libs/ui';
import { DashboardSidebar } from './ui/sidebar';

@Component({
  selector: 'dashboard-layout',
  imports: [
    MatIconModule,
    MatButtonModule,
    RouterOutlet,
    MatSidenavContainer,
    MatSidenav,
    MatSidenavContent,
    DashboardSidebar,
    SchemeSwitcher,
    LanguageSwitcher,
    TranslocoPipe
  ],
  templateUrl: './layout.html'
})
export class DashboardLayout {
  private media = inject(Media);
  protected isMobile = computed(() => this.media.match(`(max-width: 1023px)`)());
}
