import { DecimalPipe } from '@angular/common';
import { Component, input } from '@angular/core';
import { MatCard, MatCardContent } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { TranslocoPipe } from '@jsverse/transloco';
import { IAnalyticsMetric } from '../../interfaces';

@Component({
  selector: 'analytics-metric-grid',
  imports: [DecimalPipe, MatCard, MatCardContent, MatIcon, TranslocoPipe],
  templateUrl: './analytics-metric-grid.html'
})
export class AnalyticsMetricGrid {
  readonly metrics = input.required<IAnalyticsMetric[]>();
}
