import { IUserQuery } from './user-query.interface';

export interface IImportCsvPayload {
  file: File;
  query: IUserQuery;
}
