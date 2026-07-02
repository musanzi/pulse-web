import { Component, computed, inject, signal } from '@angular/core';
import { email, form, FormField, required, submit } from '@angular/forms/signals';
import { MatButton } from '@angular/material/button';
import { MatDivider } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { AuthStore } from '@website/app/auth/data-access';
import { getProfileAvatarUrl } from '@website/app/dashboard/utils/avatar-url';

const MAX_AVATAR_SIZE = 2 * 1024 * 1024;
const ALLOWED_AVATAR_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

@Component({
  selector: 'account-settings',
  imports: [MatButton, MatDivider, MatIcon, MatFormFieldModule, MatInputModule, FormField, TranslocoPipe],
  templateUrl: './account.html'
})
export class ProfileAccount {
  protected readonly authStore = inject(AuthStore);
  private readonly transloco = inject(TranslocoService);

  protected readonly avatarUrl = computed(() => getProfileAvatarUrl(this.authStore.user()?.avatar ?? null));
  protected accountSettingsModel = signal(this.getUserFormValue());
  protected accountSettingsForm = form(this.accountSettingsModel, (schema) => {
    required(schema.name, { message: 'validation.nameRequired' });
    required(schema.email, { message: 'validation.emailRequired' });
    email(schema.email, { message: 'validation.emailInvalid' });
  });

  constructor() {
    this.authStore.clearMessages();
  }

  protected save(event: Event): void {
    event.preventDefault();
    this.authStore.clearMessages();

    submit(this.accountSettingsForm, async () => {
      this.authStore.updateProfile(this.accountSettingsModel());
    });
  }

  protected uploadAvatar(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) {
      return;
    }

    this.authStore.clearMessages();

    if (!ALLOWED_AVATAR_TYPES.includes(file.type)) {
      this.authStore.setError(this.transloco.translate('profile.account.avatarTypeError'));
      input.value = '';
      return;
    }

    if (file.size > MAX_AVATAR_SIZE) {
      this.authStore.setError(this.transloco.translate('profile.account.avatarSizeError'));
      input.value = '';
      return;
    }

    this.authStore.updateAvatar(file);
    input.value = '';
  }

  private getUserFormValue(): { name: string; email: string } {
    const user = this.authStore.user();

    return {
      name: user?.name ?? '',
      email: user?.email ?? ''
    };
  }
}
