import { inject } from '@angular/core';
import { patchState, signalStore, withMethods, withProps, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { IBetaFeedbackSubmission } from '@libs/utils';
import { catchError, finalize, of, pipe, switchMap, tap } from 'rxjs';
import { IBetaFeedbackState } from '../interfaces';
import { BetaFeedbackService } from './beta-feedback.service';

const initialState: IBetaFeedbackState = {
  error: null,
  lastSubmission: null,
  submitting: false
};

export const BetaFeedbackStore = signalStore(
  withState(initialState),
  withProps(() => ({ feedbackService: inject(BetaFeedbackService) })),
  withMethods(({ feedbackService, ...store }) => ({
    clearConfirmation(): void {
      patchState(store, { error: null, lastSubmission: null });
    },
    submitFeedback: rxMethod<IBetaFeedbackSubmission>(
      pipe(
        tap(() => patchState(store, { error: null, lastSubmission: null, submitting: true })),
        switchMap((payload) =>
          feedbackService.submitFeedback(payload).pipe(
            tap((lastSubmission) => patchState(store, { lastSubmission })),
            catchError(() => {
              patchState(store, { error: 'betaFeedback.errors.submit' });
              return of(null);
            }),
            finalize(() => patchState(store, { submitting: false }))
          )
        )
      )
    )
  }))
);
