import { Component, input } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDivider } from '@angular/material/divider';
import { MatIcon } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { TranslocoPipe } from '@jsverse/transloco';
import { IMatchInsight } from '../../interfaces';

@Component({
  selector: 'app-match-score-card',
  imports: [MatButton, MatCardModule, MatChipsModule, MatDivider, MatIcon, RouterLink, TranslocoPipe],
  templateUrl: './match-score-card.html'
})
export class MatchScoreCard {
  readonly insight = input.required<IMatchInsight>();
}
