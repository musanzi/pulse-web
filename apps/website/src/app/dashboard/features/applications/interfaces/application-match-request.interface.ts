import { ITalentProfile } from './talent-profile.interface';

export interface IApplicationMatchRequest {
  applicationId: string;
  roleId: string;
  talentProfile: ITalentProfile;
}
