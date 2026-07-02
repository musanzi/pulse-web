import { IStat } from './stat.interface';

export interface IStatsState {
  data: IStat[];
  error: string | null;
  isLoading: boolean;
}
