import { DatePipe } from '@angular/common';
import { Component, computed, input } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { TranslocoPipe } from '@jsverse/transloco';
import { IAnalyticsUsagePoint } from '../../interfaces';

@Component({
  selector: 'analytics-usage-chart',
  imports: [DatePipe, MatIcon, TranslocoPipe],
  templateUrl: './analytics-usage-chart.html'
})
export class AnalyticsUsageChart {
  readonly points = input.required<IAnalyticsUsagePoint[]>();

  protected readonly maximum = computed(() =>
    Math.max(1, ...this.points().flatMap((point) => [point.activeUsers, point.messages, point.aiMatches]))
  );

  protected height(value: number): number {
    return Math.max(8, Math.round((value / this.maximum()) * 100));
  }
}
