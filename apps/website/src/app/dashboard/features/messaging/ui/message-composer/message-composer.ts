import { Component, input, output } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatFormField, MatHint, MatLabel } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { TranslocoPipe } from '@jsverse/transloco';

@Component({
  selector: 'messaging-message-composer',
  imports: [MatButton, MatFormField, MatHint, MatIcon, MatInput, MatLabel, ReactiveFormsModule, TranslocoPipe],
  templateUrl: './message-composer.html'
})
export class MessageComposer {
  readonly disabled = input(false);
  readonly sending = input(false);
  readonly messageSent = output<string>();

  protected readonly message = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required, Validators.maxLength(1000)]
  });

  protected submit(): void {
    const body = this.message.value.trim();

    if (!body || this.message.invalid || this.disabled() || this.sending()) {
      return;
    }

    this.messageSent.emit(body);
    this.message.reset();
  }
}
