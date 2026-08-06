import '@angular/compiler';
import { createEnvironmentInjector, runInInjectionContext } from '@angular/core';
import { IBetaFeedbackRecord } from '@libs/utils';
import { of } from 'rxjs';
import { describe, expect, it } from 'vitest';
import { BetaFeedbackService } from './beta-feedback.service';
import { BetaFeedbackStore } from './beta-feedback.store';

describe('BetaFeedbackStore', () => {
  it('persists a beta submission and exposes its confirmation', () => {
    const savedFeedback: IBetaFeedbackRecord = {
      category: 'ai-match',
      contactAllowed: false,
      details: 'The rationale was clear, but the next action was hard to find.',
      id: 'feedback-1',
      rating: 4,
      role: 'talent',
      route: '/dashboard/applications',
      source: 'beta',
      status: 'new',
      submittedAt: '2026-07-27T12:00:00.000Z',
      updatedAt: '2026-07-27T12:00:00.000Z'
    };
    const injector = createEnvironmentInjector([
      {
        provide: BetaFeedbackService,
        useValue: { submitFeedback: () => of(savedFeedback) }
      }
    ]);
    const store = runInInjectionContext(injector, () => new BetaFeedbackStore());

    store.submitFeedback({
      category: 'ai-match',
      contactAllowed: false,
      details: savedFeedback.details,
      rating: 4,
      role: 'talent',
      route: '/dashboard/applications'
    });

    expect(store.submitting()).toBe(false);
    expect(store.error()).toBeNull();
    expect(store.lastSubmission()).toEqual(savedFeedback);

    injector.destroy();
  });
});
