import { Component, inject } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { RouterLink } from '@angular/router';
import { TranslocoPipe } from '@jsverse/transloco';
import { ApplicationMatchStore } from '../../data-access';
import { AiRationalePanel, MatchScoreCard } from '../../ui';

@Component({
  selector: 'app-applications',
  imports: [AiRationalePanel, MatchScoreCard, MatButton, MatIcon, MatProgressSpinner, RouterLink, TranslocoPipe],
  templateUrl: './applications.html'
})
export class Applications {
  protected readonly applicationMatchStore = inject(ApplicationMatchStore);

  constructor() {
    this.applicationMatchStore.loadMatchResult({
      applicationId: null,
      roleId: 'current-recommendation'
    });
  }
}
