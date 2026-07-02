import { IUserPayload } from './user-payload.interface';
import { IUserQuery } from './user-query.interface';

export interface ICreateUserPayload {
  payload: IUserPayload;
  query: IUserQuery;
  userId?: string;
}
