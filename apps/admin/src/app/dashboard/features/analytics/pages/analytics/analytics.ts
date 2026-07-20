import { DatePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButtonToggle, MatButtonToggleGroup } from '@angular/material/button-toggle';
import { MatIcon } from '@angular/material/icon';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { TranslocoPipe } from '@jsverse/transloco';
import { environment } from '../../../../../../environments/environment';
import { AdminAnalyticsStore } from '../../data-access';
import { IAnalyticsFilter } from '../../interfaces';
import { AnalyticsMetricGrid, AnalyticsReportList, AnalyticsUsageChart, ProgramOversightTable } from '../../ui';

@Component({
  selector: 'admin-analytics',
  imports: [
    AnalyticsMetricGrid,
    AnalyticsReportList,
    AnalyticsUsageChart,
    DatePipe,
    MatButtonToggle,
    MatButtonToggleGroup,
    MatIcon,
    MatProgressSpinner,
    ProgramOversightTable,
    TranslocoPipe
  ],
  templateUrl: './analytics.html'
})
export class Analytics {
  protected readonly analyticsStore = inject(AdminAnalyticsStore);
  protected readonly websiteUrl = environment.websiteUrl;

  constructor() {
    this.analyticsStore.loadAnalytics({ range: '30d' });
  }

  protected setRange(range: IAnalyticsFilter['range']): void {
    this.analyticsStore.setRange(range);
  }
}
