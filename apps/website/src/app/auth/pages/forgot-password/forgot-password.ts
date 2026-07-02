import { Component, inject, signal } from '@angular/core';
import { email, form, FormField, required, submit } from '@angular/forms/signals';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { RouterLink } from '@angular/router';
import { TranslocoPipe } from '@jsverse/transloco';
import { AuthStore } from '../../data-access';

@Component({
  selector: 'auth-forgot-password',
  templateUrl: './forgot-password.html',
  imports: [MatFormFieldModule, RouterLink, MatInputModule, MatButtonModule, MatIconModule, FormField, TranslocoPipe]
})
export class AuthForgotPassword {
  protected authStore = inject(AuthStore);
  protected forgotPasswordFormModel = signal({
    email: ''
  });
  protected forgotPasswordForm = form(this.forgotPasswordFormModel, (form) => {
    required(form.email, { message: 'validation.emailRequired' });
    email(form.email, { message: 'validation.emailInvalid' });
  });

  forgotPassword(event: Event) {
    event.preventDefault();
    submit(this.forgotPasswordForm, async () => {
      this.authStore.forgotPassword(this.forgotPasswordFormModel());
    });
  }
}
