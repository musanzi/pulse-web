import { inject } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { CanActivateFn, Router } from '@angular/router';
import { filter, map, take } from 'rxjs';
import { AuthStore } from './auth.store';

export const authGuard: CanActivateFn = () => {
  const authStore = inject(AuthStore);
  const router = inject(Router);

  return toObservable(authStore.isVerifying).pipe(
    filter((isVerifying) => !isVerifying),
    take(1),
    map(() => (authStore.user() ? true : router.createUrlTree(['/auth/sign-in'])))
  );
};

export const unauthGuard: CanActivateFn = () => {
  const authStore = inject(AuthStore);
  const router = inject(Router);

  return toObservable(authStore.isVerifying).pipe(
    filter((isVerifying) => !isVerifying),
    take(1),
    map(() => (authStore.user() ? router.createUrlTree(['/dashboard']) : true))
  );
};
