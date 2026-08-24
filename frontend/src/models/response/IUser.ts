export type AuthType = "EMAIL" | "GOOGLE" | "APPLE";
export interface IUser {
  name: string;
  id: string;
  email: string;
  isActivated: boolean;
  authType: AuthType;
  googleId: string | null;

}
