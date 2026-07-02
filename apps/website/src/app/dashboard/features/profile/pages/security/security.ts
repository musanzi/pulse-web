import { Component, effect, inject, signal } from '@angular/core';
import { form, FormField, required, submit, validate } from '@angular/forms/signals';
import { MatButton } from '@angular/material/button';
import { MatDivider } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { TranslocoPipe } from '@jsverse/transloco';
import { AuthStore } from '@website/app/auth/data-access';

@Component({
  selector: 'security-settings',
  imports: [MatButton, MatDivider, MatIcon, MatFormFieldModule, MatInputModule, FormField, TranslocoPipe],
  templateUrl: './security.html'
})
export class ProfileSecurity {
  protected readonly authStore = inject(AuthStore);

  protected securitySettingsModel = signal({
    password: '',
    confirmPassword: ''
  });
  protected securitySettingsForm = form(this.securitySettingsModel, (schema) => {
    required(schema.password, { message: 'validation.passwordRequired' });
    required(schema.confirmPassword, { message: 'validation.confirmPasswordRequired' });

    validate(schema.confirmPassword, ({ value, valueOf }) => {
      if (value() !== valueOf(schema.password)) {
        return {
          kind: 'passwordMismatch',
          message: 'validation.passwordMismatch'
        };
      }

      return null;
    });
  });

  constructor() {
    this.authStore.clearMessages();

    effect(() => {
      if (this.authStore.success()) {
        this.securitySettingsModel.set({
          password: '',
          confirmPassword: ''
        });
      }
    });
  }

  protected save(event: Event): void {
    event.preventDefault();
    this.authStore.clearMessages();

    submit(this.securitySettingsForm, async () => {
      this.authStore.updatePassword({ password: this.securitySettingsModel().password });
    });
  }
}
