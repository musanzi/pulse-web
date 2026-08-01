import { Component, inject } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { TranslocoPipe } from '@jsverse/transloco';
import { IBetaFeedbackSubmission } from '@libs/utils';
import { BetaFeedbackStore } from '../../data-access';
import { BetaFeedbackForm } from '../../ui';

@Component({
  selector: 'app-beta-feedback',
  imports: [BetaFeedbackForm, MatIcon, TranslocoPipe],
  templateUrl: './beta-feedback.html'
})
export class BetaFeedback {
  protected readonly feedbackStore = inject(BetaFeedbackStore);

  protected submitFeedback(payload: IBetaFeedbackSubmission): void {
    this.feedbackStore.submitFeedback(payload);
  }
}
