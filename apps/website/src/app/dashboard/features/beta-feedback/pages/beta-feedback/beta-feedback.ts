import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatIcon } from '@angular/material/icon';
import { ActivatedRoute } from '@angular/router';
import { TranslocoPipe } from '@jsverse/transloco';
import { IBetaFeedbackSubmission } from '@libs/utils';
import { map } from 'rxjs';
import { BetaFeedbackStore } from '../../data-access';
import { BetaFeedbackForm } from '../../ui';

@Component({
  selector: 'app-beta-feedback',
  imports: [BetaFeedbackForm, MatIcon, TranslocoPipe],
  templateUrl: './beta-feedback.html'
})
export class BetaFeedback {
  private readonly route = inject(ActivatedRoute);
  protected readonly feedbackStore = inject(BetaFeedbackStore);
  protected readonly initialJourney = toSignal(
    this.route.queryParamMap.pipe(map((parameters) => this.normalizeJourney(parameters.get('journey')))),
    { initialValue: '/dashboard/applications' }
  );

  protected submitFeedback(payload: IBetaFeedbackSubmission): void {
    this.feedbackStore.submitFeedback(payload);
  }

  private normalizeJourney(journey: string | null): string {
    const supportedJourneys = [
      '/dashboard/applications',
      '/dashboard/messaging',
      '/dashboard/peer-reviews',
      '/dashboard/skills-gap',
      '/dashboard/profile'
    ];

    return supportedJourneys.includes(journey ?? '') ? (journey as string) : '/dashboard/applications';
  }
}
