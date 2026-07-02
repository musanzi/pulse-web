import { inject } from '@angular/core';
import { TranslocoService } from '@jsverse/transloco';
import { getApiErrorMessage } from '@libs/utils';
import { patchState, signalStore, withMethods, withProps, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { catchError, exhaustMap, finalize, of, pipe, tap } from 'rxjs';
import { IStatsState } from '../interfaces';
import { StatsService } from './stats.service';

const initialState: IStatsState = {
  data: [],
  error: null,
  isLoading: false
};

export const StatsStore = signalStore(
  withState(initialState),
  withProps(() => ({
    statsService: inject(StatsService)
  })),
  withMethods(({ statsService, ...store }, transloco = inject(TranslocoService)) => ({
    loadStats: rxMethod<void>(
      pipe(
        tap(() => patchState(store, { error: null, isLoading: true })),
        exhaustMap(() =>
          statsService.findAll().pipe(
            tap((data) => patchState(store, { data })),
            catchError((error: Error) => {
              patchState(store, { error: getApiErrorMessage(error, transloco.translate('admin.messages.statsLoadFailed')) });
              return of(null);
            }),
            finalize(() => patchState(store, { isLoading: false }))
          )
        )
      )
    ),
    clearMessages(): void {
      patchState(store, { error: null });
    }
  }))
);
