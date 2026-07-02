import { IRole, IUser } from '@libs/utils';

export interface IUserFormDialog {
  roles: IRole[];
  user?: IUser;
}
