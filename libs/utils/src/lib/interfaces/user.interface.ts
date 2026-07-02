export interface IUser {
  id: string;
  name: string;
  email: string;
  password: string;
  avatar: string | null;
  roles: string[];
}
