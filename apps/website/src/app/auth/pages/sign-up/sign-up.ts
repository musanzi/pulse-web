import { Component, inject, signal } from '@angular/core';
import { email, form, FormField, required, submit, validate } from '@angular/forms/signals';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { RouterLink } from '@angular/router';
import { TranslocoPipe } from '@jsverse/transloco';
import { AuthStore } from '../../data-access';

@Component({
  selector: 'auth-sign-up',
  templateUrl: './sign-up.html',
  imports: [RouterLink, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, FormField, TranslocoPipe]
})
export class AuthSignUp {
  protected authStore = inject(AuthStore);
  protected signUpFormModel = signal({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  protected signUpForm = form(this.signUpFormModel, (form) => {
    required(form.name, { message: 'validation.nameRequired' });
    required(form.email, { message: 'validation.emailRequired' });
    email(form.email, { message: 'validation.emailInvalid' });
    required(form.password, { message: 'validation.passwordRequired' });
    required(form.confirmPassword, { message: 'validation.confirmPasswordRequired' });
    validate(form.confirmPassword, ({ value, valueOf }) => {
      if (value() !== valueOf(form.password)) {
        return {
          kind: 'passwordMismatch',
          message: 'validation.passwordMismatch'
        };
      }
      return null;
    });
  });

  signUp(event: Event) {
    event.preventDefault();
    submit(this.signUpForm, async () => {
      const { email, name, password } = this.signUpFormModel();
      this.authStore.signUp({ email, name, password });
    });
  }
}
