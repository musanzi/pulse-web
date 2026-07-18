import { IMatchInsight } from './imatch-insight.interface';
import { ITalentProfile } from './talent-profile.interface';

export interface IApplicationMatchState {
  loading: boolean;
  error: string | null;
  talentProfile: ITalentProfile | null;
  matchResult: IMatchInsight | null;
}
