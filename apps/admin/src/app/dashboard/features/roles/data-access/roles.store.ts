import { computed, inject } from '@angular/core';
import { TranslocoService } from '@jsverse/transloco';
import { decrementTotal, getApiErrorMessage, matchesQuery } from '@libs/utils';
import { patchState, signalStore, withComputed, withMethods, withProps, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { catchError, exhaustMap, finalize, of, pipe, tap } from 'rxjs';
import { IDeleteRolePayload, IRoleQuery, IRolesState, ISaveRolePayload } from '../interfaces';
import { RolesService } from './roles.service';

const initialState: IRolesState = {
  data: [[], 0],
  error: null,
  isLoading: false,
  success: null
};

export const RolesStore = signalStore(
  withState(initialState),
  withComputed(({ data }) => ({
    roles: computed(() => data()[0]),
    rolesById: computed(() => new Map(data()[0].map((role) => [role.id, role.name]))),
    total: computed(() => data()[1])
  })),
  withProps(() => ({
    rolesService: inject(RolesService)
  })),
  withMethods(({ rolesService, ...store }, transloco = inject(TranslocoService)) => ({
    loadRoles: rxMethod<IRoleQuery>(
      pipe(
        tap(() => patchState(store, { error: null, isLoading: true })),
        exhaustMap((query) =>
          rolesService.findAll(query).pipe(
            tap((data) => patchState(store, { data })),
            catchError((error: Error) => {
              patchState(store, { error: getApiErrorMessage(error, transloco.translate('admin.messages.rolesLoadFailed')) });
              return of(null);
            }),
            finalize(() => patchState(store, { isLoading: false }))
          )
        )
      )
    ),
    deleteRole: rxMethod<IDeleteRolePayload>(
      pipe(
        tap(() => patchState(store, { error: null, success: null })),
        exhaustMap(({ roleId }) =>
          rolesService.delete(roleId).pipe(
            tap(() => {
              const [roles, total] = store.data();
              const nextRoles = roles.filter((role) => role.id !== roleId);
              const wasDeleted = nextRoles.length !== roles.length;

              patchState(store, {
                data: [nextRoles, wasDeleted ? decrementTotal(total) : total],
                success: transloco.translate('admin.messages.roleDeleted')
              });
            }),
            catchError((error: Error) => {
              patchState(store, { error: getApiErrorMessage(error, transloco.translate('admin.messages.roleDeleteFailed')) });
              return of(null);
            })
          )
        )
      )
    ),
    saveRole: rxMethod<ISaveRolePayload>(
      pipe(
        tap(() => patchState(store, { error: null, success: null })),
        exhaustMap(({ payload, query, roleId }) => {
          const request = roleId ? rolesService.update(roleId, payload) : rolesService.create(payload);
          return request.pipe(
            tap((savedRole) => {
              const [roles, total] = store.data();

              if (roleId) {
                const roleExists = roles.some((role) => role.id === roleId);
                const nextRoles = matchesQuery(savedRole, query)
                  ? roles.map((role) => (role.id === roleId ? savedRole : role))
                  : roles.filter((role) => role.id !== roleId);

                patchState(store, {
                  data: [nextRoles, roleExists && !matchesQuery(savedRole, query) ? decrementTotal(total) : total],
                  success: transloco.translate('admin.messages.roleUpdated')
                });

                return;
              }

              patchState(store, {
                data: matchesQuery(savedRole, query) ? [[savedRole, ...roles], total + 1] : [roles, total],
                success: transloco.translate('admin.messages.roleCreated')
              });
            }),
            catchError((error: Error) => {
              patchState(store, {
                error: getApiErrorMessage(
                  error,
                  transloco.translate(roleId ? 'admin.messages.roleUpdateFailed' : 'admin.messages.roleCreateFailed')
                )
              });
              return of(null);
            })
          );
        })
      )
    ),
    clearMessages(): void {
      patchState(store, { error: null, success: null });
    }
  }))
);
