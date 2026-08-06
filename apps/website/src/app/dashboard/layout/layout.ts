import { Component, computed, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenav, MatSidenavContainer, MatSidenavContent } from '@angular/material/sidenav';
import { MatTooltip } from '@angular/material/tooltip';
import { NavigationEnd, Router, RouterLink, RouterOutlet } from '@angular/router';
import { TranslocoPipe } from '@jsverse/transloco';
import { Media } from '@libs/core';
import { LanguageSwitcher, SchemeSwitcher } from '@libs/ui';
import { filter } from 'rxjs';
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
    MatTooltip,
    DashboardSidebar,
    RouterLink,
    SchemeSwitcher,
    LanguageSwitcher,
    TranslocoPipe
  ],
  templateUrl: './layout.html'
})
export class DashboardLayout {
  private readonly destroyRef = inject(DestroyRef);
  private readonly media = inject(Media);
  private readonly router = inject(Router);
  protected isMobile = computed(() => this.media.match(`(max-width: 1023px)`)());
  protected readonly currentUrl = signal(this.router.url);
  protected readonly feedbackJourney = signal(this.toFeedbackJourney(this.router.url));
  protected readonly showFeedbackShortcut = computed(() => !this.currentUrl().startsWith('/dashboard/feedback'));

  constructor() {
    this.router.events
      .pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((event) => {
        this.currentUrl.set(event.urlAfterRedirects);
        this.feedbackJourney.set(this.toFeedbackJourney(event.urlAfterRedirects));
      });
  }

  private toFeedbackJourney(url: string): string {
    const pathname = url.split(/[?#]/, 1)[0] ?? '/dashboard/applications';
    const journeys = [
      '/dashboard/applications',
      '/dashboard/messaging',
      '/dashboard/peer-reviews',
      '/dashboard/skills-gap',
      '/dashboard/profile'
    ];

    return journeys.find((journey) => pathname.startsWith(journey)) ?? '/dashboard/applications';
  }
}
