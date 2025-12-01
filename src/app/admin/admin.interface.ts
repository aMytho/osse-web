import { UserPermission } from "../shared/services/auth/auth.interface";

export interface User {
  id: number;
  username: string;
  created_at: string;
  permissions: UserPermission[];
}
