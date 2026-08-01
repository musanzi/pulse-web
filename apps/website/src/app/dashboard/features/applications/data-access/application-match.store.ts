import { inject } from '@angular/core';
import { patchState, signalStore, withMethods, withProps, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { catchError, finalize, of, pipe, switchMap, tap } from 'rxjs';
import { IApplicationMatchRequest, IApplicationMatchState } from '../interfaces';
import { ApplicationMatchService } from './application-match.service';
import { TalentProfileAdapter } from './talent-profile.adapter';
import { TalentProfileService } from './talent-profile.service';

const initialState: IApplicationMatchState = {
  error: null,
  loading: false,
  matchResult: null,
  talentProfile: null
};

export const ApplicationMatchStore = signalStore(
  withState(initialState),
  withProps(() => ({
    applicationMatchService: inject(ApplicationMatchService),
    talentProfileAdapter: inject(TalentProfileAdapter),
    talentProfileService: inject(TalentProfileService)
  })),
  withMethods(({ applicationMatchService, talentProfileAdapter, talentProfileService, ...store }) => ({
    loadMatchResult: rxMethod<IApplicationMatchRequest>(
      pipe(
        tap(() =>
          patchState(store, {
            error: null,
            loading: true,
            matchResult: null,
            talentProfile: null
          })
        ),
        switchMap((request) =>
          talentProfileService.loadMyProfile().pipe(
            switchMap((apiProfile) => {
              const talentProfile = talentProfileAdapter.fromApi(apiProfile);
              patchState(store, { talentProfile });

              return applicationMatchService.loadMatchResult(request, talentProfile);
            }),
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
