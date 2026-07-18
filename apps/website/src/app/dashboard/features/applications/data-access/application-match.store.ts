import { inject } from '@angular/core';
import { patchState, signalStore, withMethods, withProps, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { catchError, finalize, of, pipe, switchMap, tap } from 'rxjs';
import { IApplicationMatchRequest, IApplicationMatchState } from '../interfaces';
import { ApplicationMatchService } from './application-match.service';

const initialState: IApplicationMatchState = {
  error: null,
  loading: false,
  matchResult: null,
  talentProfile: null
};

export const ApplicationMatchStore = signalStore(
  withState(initialState),
  withProps(() => ({
    applicationMatchService: inject(ApplicationMatchService)
  })),
  withMethods(({ applicationMatchService, ...store }) => ({
    loadMatchResult: rxMethod<IApplicationMatchRequest>(
      pipe(
        tap((request) =>
          patchState(store, {
            error: null,
            loading: true,
            talentProfile: request.talentProfile
          })
        ),
        switchMap((request) =>
          applicationMatchService.loadMatchResult(request).pipe(
            tap((matchResult) => patchState(store, { matchResult })),
            catchError(() => {
              patchState(store, {
                error: 'applications.match.loadFailed',
                matchResult: null
              });
              return of(null);
            }),
            finalize(() => patchState(store, { loading: false }))
          )
        )
      )
    ),
    clearMatchResult(): void {
      patchState(store, { error: null, loading: false, matchResult: null, talentProfile: null });
    }
  }))
);
