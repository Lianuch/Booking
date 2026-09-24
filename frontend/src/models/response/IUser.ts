import type { AuthType } from "../../types/auth.type";
import type { RoleType } from "../../types/role.type";

export interface IUser {
  name: string;
  id: string;
  email: string;
  isActivated: boolean;
  authType: AuthType;
  googleId: string | null;
  role: RoleType;
}
