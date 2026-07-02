import { Component, computed, inject, signal } from '@angular/core';
import { form, FormField, minLength, required, submit, validate } from '@angular/forms/signals';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { TranslocoPipe } from '@jsverse/transloco';
import { AuthStore } from '../../data-access';

@Component({
  selector: 'auth-reset-password',
  templateUrl: './reset-password.html',
  imports: [RouterLink, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, FormField, TranslocoPipe]
})
export class AuthResetPassword {
  private route = inject(ActivatedRoute);
  protected authStore = inject(AuthStore);
  protected token = signal(this.route.snapshot.queryParamMap.get('token') ?? '');
  protected hasToken = computed(() => this.token().trim().length > 0);
  protected resetPasswordFormModel = signal({
    password: '',
    confirmPassword: ''
  });
  protected resetPasswordForm = form(this.resetPasswordFormModel, (form) => {
    required(form.password, { message: 'validation.passwordRequired' });
    minLength(form.password, 6, { message: 'validation.passwordMinLength' });
    required(form.confirmPassword, {
      message: 'validation.confirmPasswordRequired'
    });
    validate(form.confirmPassword, (ctx) => {
      const password = ctx.valueOf(form.password);
      const confirmPassword = ctx.value();

      if (!password || !confirmPassword) return null;

      if (password !== confirmPassword) {
        return {
          kind: 'mismatch',
          message: 'validation.passwordMismatch'
        };
      }

      return null;
    });
  });

  resetPassword(event: Event) {
    event.preventDefault();
    if (!this.hasToken()) return;

    submit(this.resetPasswordForm, async () => {
      this.authStore.resetPassword({
        password: this.resetPasswordFormModel().password,
        token: this.token()
      });
    });
  }
}
