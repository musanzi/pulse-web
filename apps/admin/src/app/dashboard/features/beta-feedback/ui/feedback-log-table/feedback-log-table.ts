import { DatePipe } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { TranslocoPipe } from '@jsverse/transloco';
import { BetaFeedbackStatus, IBetaFeedbackRecord } from '@libs/utils';

@Component({
  selector: 'admin-feedback-log-table',
  imports: [DatePipe, MatProgressSpinner, MatSelectModule, MatTableModule, TranslocoPipe],
  templateUrl: './feedback-log-table.html'
})
export class FeedbackLogTable {
  readonly entries = input.required<IBetaFeedbackRecord[]>();
  readonly updatingId = input<string | null>(null);
  readonly statusChanged = output<{ id: string; status: BetaFeedbackStatus }>();

  protected readonly displayedColumns = ['submittedAt', 'tester', 'feedback', 'rating', 'status'];
  protected readonly statuses: BetaFeedbackStatus[] = ['new', 'reviewing', 'planned', 'resolved'];

  protected updateStatus(id: string, status: BetaFeedbackStatus): void {
    this.statusChanged.emit({ id, status });
  }
}
