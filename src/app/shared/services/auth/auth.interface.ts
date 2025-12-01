/**
 * A successful auth response.
 */
export interface AuthResponse {
  /**
   * User ID
   */
  id: number,
  username: string,
  settings: UserSettings;
  permissions: UserPermission[];
}

export interface UserSettings {
  id: number;
  queue: boolean;
}

export interface UserPermission {
  id: number;
  name: string;
  description: string;
}

export enum Permission {
  Admin = 1,
  PasswordManager = 2
}
