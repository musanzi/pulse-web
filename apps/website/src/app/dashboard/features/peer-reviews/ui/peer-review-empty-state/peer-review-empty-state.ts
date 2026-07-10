import { Component } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { TranslocoPipe } from '@jsverse/transloco';

@Component({
  selector: 'app-peer-review-empty-state',
  imports: [
    MatButton,
    MatCardModule,
    MatIcon,
    RouterLink,
    TranslocoPipe
  ],
  templateUrl: './peer-review-empty-state.html'
})
export class PeerReviewEmptyState { }