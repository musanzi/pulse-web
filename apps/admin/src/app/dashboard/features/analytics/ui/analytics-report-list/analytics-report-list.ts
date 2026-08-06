import { DatePipe, UpperCasePipe } from '@angular/common';
import { Component, input } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { TranslocoPipe } from '@jsverse/transloco';
import { IAnalyticsReport } from '../../interfaces';

@Component({
  selector: 'analytics-report-list',
  imports: [DatePipe, MatIcon, MatIconButton, TranslocoPipe, UpperCasePipe],
  templateUrl: './analytics-report-list.html'
})
export class AnalyticsReportList {
  readonly reports = input.required<IAnalyticsReport[]>();
}
