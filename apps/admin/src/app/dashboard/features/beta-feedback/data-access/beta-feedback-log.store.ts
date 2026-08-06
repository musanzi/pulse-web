import { computed, inject } from '@angular/core';
import { patchState, signalStore, withComputed, withMethods, withProps, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { BetaFeedbackStatus } from '@libs/utils';
import { catchError, finalize, of, pipe, switchMap, tap } from 'rxjs';
import { BetaFeedbackCategoryFilter, BetaFeedbackStatusFilter, IBetaFeedbackLogState } from '../interfaces';
import { BetaFeedbackLogService } from './beta-feedback-log.service';

const initialState: IBetaFeedbackLogState = {
  category: 'all',
  entries: [],
  error: null,
  loading: false,
  status: 'all',
  updatingId: null
};

export const BetaFeedbackLogStore = signalStore(
  withState(initialState),
  withProps(() => ({ feedbackService: inject(BetaFeedbackLogService) })),
  withComputed(({ category, entries, status }) => ({
    filteredEntries: computed(() =>
      entries().filter(
        (entry) =>
          (category() === 'all' || entry.category === category()) && (status() === 'all' || entry.status === status())
      )
    ),
    summary: computed(() => {
      const records = entries();
      const total = records.length;
      return {
        averageRating: total
          ? Math.round((records.reduce((sum, record) => sum + record.rating, 0) / total) * 10) / 10
          : 0,
        newCount: records.filter((record) => record.status === 'new').length,
        resolvedCount: records.filter((record) => record.status === 'resolved').length,
        total
      };
    })
  })),
  withMethods(({ feedbackService, ...store }) => ({
    loadFeedback: rxMethod<void>(
      pipe(
        tap(() => patchState(store, { error: null, loading: true })),
        switchMap(() =>
          feedbackService.loadFeedback().pipe(
            tap((entries) => patchState(store, { entries })),
            catchError(() => {
              patchState(store, { error: 'admin.betaFeedback.errors.load' });
              return of(null);
            }),
            finalize(() => patchState(store, { loading: false }))
          )
        )
      )
    ),
    setCategory(category: BetaFeedbackCategoryFilter): void {
      patchState(store, { category });
    },
    setStatus(status: BetaFeedbackStatusFilter): void {
      patchState(store, { status });
    },
    updateStatus: rxMethod<{ id: string; status: BetaFeedbackStatus }>(
      pipe(
        tap(({ id }) => patchState(store, { error: null, updatingId: id })),
        switchMap(({ id, status }) =>
          feedbackService.updateStatus(id, status).pipe(
            tap((updated) =>
              patchState(store, {
                entries: store.entries().map((entry) => (entry.id === updated.id ? updated : entry))
              })
            ),
            catchError(() => {
              patchState(store, { error: 'admin.betaFeedback.errors.update' });
              return of(null);
            }),
            finalize(() => patchState(store, { updatingId: null }))
          )
        )
      )
    )
  }))
);
