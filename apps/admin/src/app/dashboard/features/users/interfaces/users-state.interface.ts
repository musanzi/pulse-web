import { IUser } from '@libs/utils';

export interface IUsersState {
  isExporting: boolean;
  isImporting: boolean;
  isLoading: boolean;
  success: string | null;
  error: string | null;
  data: [IUser[], number];
}
