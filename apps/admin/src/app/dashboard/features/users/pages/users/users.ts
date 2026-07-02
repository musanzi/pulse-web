import { Component, DestroyRef, ElementRef, effect, inject, viewChild } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButtonModule, MatIconButton } from '@angular/material/button';
import { MatCard, MatCardHeader, MatCardContent } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { RolesStore } from '@admin/app/dashboard/features/roles/data-access';
import { ConfirmDialog } from '@admin/app/dashboard/ui/confirm-dialog/confirm-dialog';
import { getProfileAvatarUrl } from '@admin/app/dashboard/utils';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { DEFAULT_LIMIT, IRole, IUser, MAX_LIMIT } from '@libs/utils';
import { UsersStore } from '../../data-access';
import { IUserPayload, IUserQuery } from '../../interfaces';
import { UserFormDialog } from '../../ui/user-form-dialog/user-form-dialog';

@Component({
  selector: 'admin-users',
  providers: [RolesStore, UsersStore],
  imports: [
    MatButtonModule,
    MatChipsModule,
    MatIconModule,
    MatPaginatorModule,
    MatTableModule,
    MatCard,
    MatCardHeader,
    MatCardContent,
    MatMenu,
    MatMenuItem,
    MatMenuTrigger,
    MatIconButton,
    TranslocoPipe
  ],
  templateUrl: './users.html'
})
export class Users {
  private readonly destroyRef = inject(DestroyRef);
  private readonly dialog = inject(MatDialog);
  private readonly snackBar = inject(MatSnackBar);
  private readonly transloco = inject(TranslocoService);

  protected readonly displayedColumns = ['name', 'email', 'roles', 'actions'];
  protected readonly fileInput = viewChild<ElementRef<HTMLInputElement>>('fileInput');
  protected readonly query = {
    limit: DEFAULT_LIMIT,
    page: 1
  } satisfies IUserQuery;
  protected readonly rolesStore = inject(RolesStore);
  protected readonly usersStore = inject(UsersStore);

  constructor() {
    this.rolesStore.loadRoles({ limit: MAX_LIMIT, page: 1 });
    this.usersStore.loadUsers(this.query);

    effect(() => {
      const error = this.usersStore.error();
      const success = this.usersStore.success();

      if (error) {
        this.snackBar.open(error, this.transloco.translate('common.close'), { duration: 5000 });
        queueMicrotask(() => this.usersStore.clearMessages());
      }

      if (success) {
        this.snackBar.open(success, this.transloco.translate('common.close'), { duration: 3000 });
        queueMicrotask(() => this.usersStore.clearMessages());
      }
    });

    effect(() => {
      const error = this.rolesStore.error();

      if (error) {
        this.snackBar.open(error, this.transloco.translate('common.close'), { duration: 5000 });
        queueMicrotask(() => this.rolesStore.clearMessages());
      }
    });
  }

  protected createUser(): void {
    this.openUserDialog();
  }

  protected deleteUser(user: IUser): void {
    this.dialog
      .open<ConfirmDialog, unknown, boolean>(ConfirmDialog, {
        data: {
          title: this.transloco.translate('admin.users.delete.title'),
          message: this.transloco.translate('admin.users.delete.message', { name: user.name })
        },
        width: '420px'
      })
      .afterClosed()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((confirmed) => {
        if (!confirmed) {
          return;
        }

        this.usersStore.deleteUser({ userId: user.id });
      });
  }

  protected editUser(user: IUser): void {
    this.openUserDialog(user);
  }

  protected exportCsv(): void {
    this.usersStore.exportCsv(this.query);
  }

  protected importCsv(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) {
      return;
    }

    input.value = '';
    this.usersStore.importCsv({ file, query: this.query });
  }

  protected openFilePicker(): void {
    this.fileInput()?.nativeElement.click();
  }

  protected pageChanged(event: PageEvent): void {
    this.query.page = event.pageIndex + 1;
    this.query.limit = Math.min(event.pageSize, MAX_LIMIT);
    this.usersStore.loadUsers(this.query);
  }

  protected roleLabel(role: string): string {
    return this.rolesStore.rolesById().get(role) ?? role;
  }

  protected trackBy(_: number, user: IUser): string {
    return user.id;
  }

  protected userAvatarUrl(user: IUser): string | null {
    return getProfileAvatarUrl(user.avatar);
  }

  protected userInitials(user: IUser): string {
    const source = user.name || user.email;
    const initials = source
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part[0])
      .join('');

    return initials.toUpperCase() || '?';
  }

  private openUserDialog(user?: IUser): void {
    this.dialog
      .open<UserFormDialog, { roles: IRole[]; user?: IUser }, IUserPayload>(UserFormDialog, {
        data: { roles: this.rolesStore.roles(), user },
        width: '560px'
      })
      .afterClosed()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((payload) => {
        if (!payload) {
          return;
        }

        this.usersStore.saveUser({ payload, query: this.query, userId: user?.id });
      });
  }
}
