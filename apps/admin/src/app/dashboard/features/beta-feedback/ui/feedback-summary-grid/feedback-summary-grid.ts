import { Component, input } from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';
import { IBetaFeedbackSummary } from '../../interfaces';

@Component({
  selector: 'admin-feedback-summary-grid',
  imports: [TranslocoPipe],
  templateUrl: './feedback-summary-grid.html'
})
export class FeedbackSummaryGrid {
  readonly summary = input.required<IBetaFeedbackSummary>();
}
