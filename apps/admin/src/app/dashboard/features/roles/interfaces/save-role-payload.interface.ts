import { IRolePayload } from './role-payload.interface';
import { IRoleQuery } from './role-query.interface';

export interface ISaveRolePayload {
  payload: IRolePayload;
  query: IRoleQuery;
  roleId?: string;
}
