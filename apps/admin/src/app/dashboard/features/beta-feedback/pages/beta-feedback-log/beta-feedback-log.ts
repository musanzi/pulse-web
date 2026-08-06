import { afterNextRender, Component, inject } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { TranslocoPipe } from '@jsverse/transloco';
import { BetaFeedbackStatus } from '@libs/utils';
import { BetaFeedbackLogStore } from '../../data-access';
import { BetaFeedbackCategoryFilter, BetaFeedbackStatusFilter } from '../../interfaces';
import { FeedbackLogTable, FeedbackSummaryGrid } from '../../ui';

@Component({
  selector: 'admin-beta-feedback-log',
  imports: [
    FeedbackLogTable,
    FeedbackSummaryGrid,
    MatButton,
    MatFormField,
    MatIcon,
    MatLabel,
    MatProgressSpinner,
    MatSelectModule,
    TranslocoPipe
  ],
  templateUrl: './beta-feedback-log.html'
})
export class BetaFeedbackLog {
  protected readonly feedbackStore = inject(BetaFeedbackLogStore);
  protected readonly categories: BetaFeedbackCategoryFilter[] = [
    'all',
    'usability',
    'ai-match',
    'messaging',
    'accessibility',
    'performance',
    'other'
  ];
  protected readonly statuses: BetaFeedbackStatusFilter[] = ['all', 'new', 'reviewing', 'planned', 'resolved'];

  constructor() {
    afterNextRender(() => this.feedbackStore.loadFeedback());
  }

  protected updateStatus(event: { id: string; status: BetaFeedbackStatus }): void {
    this.feedbackStore.updateStatus(event);
  }
}
