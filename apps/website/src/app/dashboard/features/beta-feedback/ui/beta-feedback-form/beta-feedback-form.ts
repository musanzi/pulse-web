import { Component, input, output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatButtonToggle, MatButtonToggleGroup } from '@angular/material/button-toggle';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatFormField, MatHint, MatLabel } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { TranslocoPipe } from '@jsverse/transloco';
import { BetaFeedbackCategory, BetaFeedbackRole, IBetaFeedbackSubmission } from '@libs/utils';

@Component({
  selector: 'beta-feedback-form',
  imports: [
    MatButton,
    MatButtonToggle,
    MatButtonToggleGroup,
    MatCheckbox,
    MatFormField,
    MatHint,
    MatIcon,
    MatInput,
    MatLabel,
    MatSelectModule,
    ReactiveFormsModule,
    TranslocoPipe
  ],
  templateUrl: './beta-feedback-form.html'
})
export class BetaFeedbackForm {
  readonly error = input<string | null>(null);
  readonly submitted = input(false);
  readonly submitting = input(false);
  readonly feedbackSubmitted = output<IBetaFeedbackSubmission>();
  readonly newFeedbackRequested = output<void>();

  protected readonly categories: BetaFeedbackCategory[] = [
    'usability',
    'ai-match',
    'messaging',
    'accessibility',
    'performance',
    'other'
  ];
  protected readonly ratings = [1, 2, 3, 4, 5];
  protected readonly roles: BetaFeedbackRole[] = ['talent', 'employer', 'coordinator'];
  protected readonly testedJourneys = [
    { key: 'applications', route: '/dashboard/applications' },
    { key: 'messaging', route: '/dashboard/messaging' },
    { key: 'peer-reviews', route: '/dashboard/peer-reviews' },
    { key: 'skills-gap', route: '/dashboard/skills-gap' },
    { key: 'profile', route: '/dashboard/profile' }
  ];
  protected readonly form = new FormGroup({
    category: new FormControl<BetaFeedbackCategory>('usability', { nonNullable: true }),
    contactAllowed: new FormControl(false, { nonNullable: true }),
    contactEmail: new FormControl('', { nonNullable: true, validators: [Validators.email] }),
    details: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(2000)]
    }),
    rating: new FormControl(4, {
      nonNullable: true,
      validators: [Validators.required, Validators.min(1), Validators.max(5)]
    }),
    role: new FormControl<BetaFeedbackRole>('talent', { nonNullable: true }),
    route: new FormControl('/dashboard/applications', { nonNullable: true })
  });

  protected submit(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid || this.submitting()) {
      return;
    }

    const value = this.form.getRawValue();
    this.feedbackSubmitted.emit({
      category: value.category,
      contactAllowed: value.contactAllowed,
      ...(value.contactAllowed && value.contactEmail ? { contactEmail: value.contactEmail } : {}),
      details: value.details,
      rating: value.rating,
      role: value.role,
      route: value.route
    });
  }

  protected startAnother(): void {
    this.form.reset({
      category: 'usability',
      contactAllowed: false,
      contactEmail: '',
      details: '',
      rating: 4,
      role: 'talent',
      route: '/dashboard/applications'
    });
    this.newFeedbackRequested.emit();
  }
}
