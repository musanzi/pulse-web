import { computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { getApiErrorMessage, IUser } from '@libs/utils';
import { TranslocoService } from '@jsverse/transloco';
import { patchState, signalStore, withComputed, withMethods, withProps, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { catchError, exhaustMap, finalize, of, pipe, tap } from 'rxjs';
import {
  IForgotPasswordPayload,
  IAuthState,
  IResetPasswordPayload,
  ISignInPayload,
  ISignUpPayload,
  IUpdatePasswordPayload,
  IUpdateProfilePayload
} from '../interfaces';
import { AuthService } from './auth.service';

const initialState: IAuthState = {
  user: null,
  isVerifying: true,
  isLoading: false,
  error: null,
  success: null
};

export const AuthStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed(({ user }) => ({
    isAuthenticated: computed(() => user() !== null)
  })),
  withProps(() => ({
    authService: inject(AuthService),
    router: inject(Router),
    transloco: inject(TranslocoService)
  })),
  withMethods(({ authService, router, transloco, ...store }) => ({
    updateProfile: rxMethod<IUpdateProfilePayload>(
      pipe(
        tap(() => patchState(store, { isLoading: true, error: null, success: null })),
        exhaustMap((payload) =>
          authService.updateProfile(payload).pipe(
            tap((user) => {
              patchState(store, { user, success: transloco.translate('messages.profileUpdated') });
            }),
            catchError((error: Error) => {
              patchState(store, {
                error: getApiErrorMessage(error, transloco.translate('messages.profileUpdateFailed'))
              });
              return of(null);
            }),
            finalize(() => patchState(store, { isLoading: false }))
          )
        )
      )
    ),
    updateAvatar: rxMethod<File>(
      pipe(
        tap(() => patchState(store, { isLoading: true, error: null, success: null })),
        exhaustMap((file) =>
          authService.updateAvatar(file).pipe(
            tap((user) => {
              patchState(store, { user, success: transloco.translate('messages.avatarUpdated') });
            }),
            catchError((error: Error) => {
              patchState(store, {
                error: getApiErrorMessage(error, transloco.translate('messages.avatarUpdateFailed'))
              });
              return of(null);
            }),
            finalize(() => patchState(store, { isLoading: false }))
          )
        )
      )
    ),
    updatePassword: rxMethod<IUpdatePasswordPayload>(
      pipe(
        tap(() => patchState(store, { isLoading: true, error: null, success: null })),
        exhaustMap((payload) =>
          authService.updatePassword(payload).pipe(
            tap(() => patchState(store, { success: transloco.translate('messages.passwordUpdated') })),
            catchError((error: Error) => {
              patchState(store, {
                error: getApiErrorMessage(error, transloco.translate('messages.passwordUpdateFailed'))
              });
              return of(null);
            }),
            finalize(() => patchState(store, { isLoading: false }))
          )
        )
      )
    ),
    signUp: rxMethod<ISignUpPayload>(
      pipe(
        tap(() => patchState(store, { isLoading: true, error: null })),
        exhaustMap((dto) =>
          authService.signUp(dto).pipe(
            tap((user) => {
              console.log(user);
              patchState(store, { user });
              router.navigateByUrl('/');
            }),
            catchError((error: Error) => {
              patchState(store, {
                user: null,
                error: getApiErrorMessage(error, transloco.translate('messages.authFailed'))
              });
              return of(null);
            }),
            finalize(() => patchState(store, { isLoading: false }))
          )
        )
      )
    ),
    signIn: rxMethod<ISignInPayload>(
      pipe(
        tap(() => patchState(store, { isLoading: true, error: null })),
        exhaustMap((dto) =>
          authService.signIn(dto).pipe(
            tap((user) => {
              patchState(store, { user });
              router.navigateByUrl('/');
            }),
            catchError((error: Error) => {
              patchState(store, {
                user: null,
                error: getApiErrorMessage(error, transloco.translate('messages.authFailed'))
              });
              return of(null);
            }),
            finalize(() => patchState(store, { isLoading: false }))
          )
        )
      )
    ),
    signOut: rxMethod<void>(
      pipe(
        tap(() => patchState(store, { isLoading: true, error: null })),
        exhaustMap(() =>
          authService.signOut().pipe(
            tap(() => {
              patchState(store, { user: null });
              router.navigateByUrl('/auth/sign-in');
            }),
            catchError((error: Error) => {
              patchState(store, { error: getApiErrorMessage(error, transloco.translate('messages.signOutFailed')) });
              return of(null);
            }),
            finalize(() => patchState(store, { isLoading: false }))
          )
        )
      )
    ),
    forgotPassword: rxMethod<IForgotPasswordPayload>(
      pipe(
        tap(() => patchState(store, { isLoading: true, error: null })),
        exhaustMap((payload) =>
          authService.forgotPassword(payload).pipe(
            tap(() => router.navigateByUrl('/auth/forgot-password/sent')),
            catchError((error: Error) => {
              patchState(store, {
                error: getApiErrorMessage(error, transloco.translate('messages.resetLinkFailed'))
              });
              return of(null);
            }),
            finalize(() => patchState(store, { isLoading: false }))
          )
        )
      )
    ),
    resetPassword: rxMethod<IResetPasswordPayload>(
      pipe(
        tap(() => patchState(store, { isLoading: true, error: null })),
        exhaustMap((payload) =>
          authService.resetPassword(payload).pipe(
            tap(() =>
              router.navigateByUrl('/auth/sign-in', {
                state: { successMessage: transloco.translate('messages.passwordResetSuccess') }
              })
            ),
            catchError((error: Error) => {
              patchState(store, {
                error: getApiErrorMessage(error, transloco.translate('messages.passwordResetFailed'))
              });
              return of(null);
            }),
            finalize(() => patchState(store, { isLoading: false }))
          )
        )
      )
    ),
    getProfile: rxMethod<void>(
      pipe(
        tap(() => patchState(store, { isVerifying: true, error: null })),
        exhaustMap(() =>
          authService.getProfile().pipe(
            tap((user) => patchState(store, { user })),
            catchError(() => {
              patchState(store, { user: null });
              return of(null);
            }),
            finalize(() => patchState(store, { isVerifying: false }))
          )
        )
      )
    ),
    clearMessages(): void {
      patchState(store, { error: null, success: null });
    },
    setError(error: string): void {
      patchState(store, { error, success: null });
    },
    setUser(user: IUser | null): void {
      patchState(store, { user });
    }
  }))
);
