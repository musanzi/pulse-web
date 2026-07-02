import { Component, effect, inject } from '@angular/core';
import { MatCard, MatCardContent, MatCardHeader } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DecimalPipe } from '@angular/common';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { IStat } from '../../interfaces';
import { StatsStore } from '../../data-access';

@Component({
  selector: 'admin-stats',
  providers: [StatsStore],
  imports: [DecimalPipe, MatCard, MatCardContent, MatCardHeader, MatIconModule, TranslocoPipe],
  templateUrl: './stats.html'
})
export class Stats {
  private readonly snackBar = inject(MatSnackBar);
  private readonly transloco = inject(TranslocoService);
  protected readonly statsStore = inject(StatsStore);

  constructor() {
    this.statsStore.loadStats();

    effect(() => {
      const error = this.statsStore.error();

      if (error) {
        this.snackBar.open(error, this.transloco.translate('common.close'), { duration: 5000 });
        queueMicrotask(() => this.statsStore.clearMessages());
      }
    });
  }

  protected trackBy(_: number, stat: IStat): string {
    return stat.label;
  }
}
