import { Component, effect, inject, signal } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { RouterLink } from '@angular/router';
import { TranslocoPipe } from '@jsverse/transloco';
import { AuthStore } from '@website/app/auth/data-access';
import { ApplicationMatchStore, TalentProfileAdapter } from '../../data-access';
import { AiRationalePanel, MatchScoreCard } from '../../ui';

@Component({
  selector: 'app-applications',
  imports: [AiRationalePanel, MatchScoreCard, MatButton, MatIcon, MatProgressSpinner, RouterLink, TranslocoPipe],
  templateUrl: './applications.html'
})
export class Applications {
  protected readonly applicationMatchStore = inject(ApplicationMatchStore);
  protected readonly authStore = inject(AuthStore);
  private readonly talentProfileAdapter = inject(TalentProfileAdapter);
  private readonly requestedUserId = signal<string | null>(null);

  constructor() {
    effect(() => {
      const user = this.authStore.user();

      if (!user || this.requestedUserId() === user.id) {
        return;
      }

      this.requestedUserId.set(user.id);
      this.applicationMatchStore.loadMatchResult({
        applicationId: `application-${user.id}`,
        roleId: 'data-analyst-intern',
        talentProfile: this.talentProfileAdapter.fromUser(user)
      });
    });
  }
}
