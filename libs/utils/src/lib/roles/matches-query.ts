import { IRole } from '../interfaces';

interface RoleQueryLike {
  q?: number | string;
}

export function matchesQuery(role: IRole, query: RoleQueryLike): boolean {
  const search = query.q?.toString().trim().toLowerCase();
  return !search || role.name.toLowerCase().includes(search);
}
