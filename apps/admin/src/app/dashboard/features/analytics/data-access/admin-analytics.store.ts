import { inject } from '@angular/core';
import { patchState, signalStore, withMethods, withProps, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { catchError, finalize, of, pipe, switchMap, tap } from 'rxjs';
import { IAdminAnalyticsState, IAnalyticsFilter } from '../interfaces';
import { AdminAnalyticsService } from './admin-analytics.service';

const initialState: IAdminAnalyticsState = {
  data: null,
  error: null,
  loading: false,
  range: '30d'
};

export const AdminAnalyticsStore = signalStore(
  withState(initialState),
  withProps(() => ({ analyticsService: inject(AdminAnalyticsService) })),
  withMethods(({ analyticsService, ...store }) => {
    const loadAnalytics = rxMethod<IAnalyticsFilter>(
      pipe(
        tap((filter) => patchState(store, { error: null, loading: true, range: filter.range })),
        switchMap((filter) =>
          analyticsService.loadAnalytics(filter).pipe(
            tap((data) => patchState(store, { data })),
            catchError(() => {
              patchState(store, { data: null, error: 'admin.analytics.errors.load' });
              return of(null);
            }),
            finalize(() => patchState(store, { loading: false }))
          )
        )
      )
    );

    return {
      loadAnalytics,
      setRange(range: IAnalyticsFilter['range']): void {
        loadAnalytics({ range });
      }
    };
  })
);
