import { IAdminAnalyticsSnapshot, IAnalyticsFilter } from './analytics.interface';

export interface IAdminAnalyticsState {
  data: IAdminAnalyticsSnapshot | null;
  error: string | null;
  loading: boolean;
  range: IAnalyticsFilter['range'];
}
