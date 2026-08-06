import { Component, computed, input } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDivider } from '@angular/material/divider';
import { MatIcon } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { TranslocoPipe } from '@jsverse/transloco';
import { IMatchInsight } from '../../interfaces';

@Component({
  selector: 'app-match-score-card',
  imports: [MatButton, MatCardModule, MatDivider, MatIcon, RouterLink, TranslocoPipe],
  templateUrl: './match-score-card.html'
})
export class MatchScoreCard {
  readonly matchResult = input.required<IMatchInsight>();

  protected readonly scoreAngle = computed(() => `${this.clampedScore() * 3.6}deg`);
  protected readonly scoreTone = computed(() => {
    const score = this.clampedScore();

    if (score >= 85) {
      return 'applications.match.highConfidence';
    }

    if (score >= 70) {
      return 'applications.match.goodConfidence';
    }

    return 'applications.match.growthConfidence';
  });

  private clampedScore(): number {
    return Math.min(100, Math.max(0, this.matchResult().compatibilityScore));
  }
}
