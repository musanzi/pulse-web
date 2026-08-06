import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { map, Observable } from 'rxjs';
import { IAdminAnalyticsSnapshot, IAnalyticsFilter, IAnalyticsMetric, IStatItemApiResponse } from '../interfaces';

@Service()
export class AdminAnalyticsService {
  private readonly http = inject(HttpClient);

  loadAnalytics(filter: IAnalyticsFilter): Observable<IAdminAnalyticsSnapshot> {
    return this.http.get<IStatItemApiResponse[]>('/stats').pipe(
      map((stats) => ({
        generatedAt: new Date().toISOString(),
        metrics: stats.map((stat, index) => this.toMetric(stat, index)),
        programs: [],
        range: filter.range,
        reports: [],
        source: 'api' as const,
        usage: []
      }))
    );
  }

  private toMetric(stat: IStatItemApiResponse, index: number): IAnalyticsMetric {
    const normalizedLabel = stat.label.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase();
    const isUserMetric = normalizedLabel.includes('utilisateur') || normalizedLabel.includes('user');
    const isRoleMetric = normalizedLabel.includes('role');

    return {
      changePercent: 0,
      format: 'number',
      icon: isUserMetric ? 'users-round' : isRoleMetric ? 'shield-check' : 'database',
      id: isUserMetric ? 'users' : isRoleMetric ? 'roles' : `stat-${index}`,
      labelKey: isUserMetric
        ? 'admin.analytics.metrics.users'
        : isRoleMetric
          ? 'admin.analytics.metrics.roles'
          : 'admin.analytics.metrics.platformRecords',
      trend: 'steady',
      value: stat.total
    };
  }
}
