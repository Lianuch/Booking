import { AuthType } from "@prisma/client";

export class UserDto {
    id: string;
    name: string;
    email: string;
    isActivated: boolean;
    authType: AuthType;
    googleId: string | null;
    
   constructor(user: { id: string; name: string; email: string; isActivated: boolean, authType: AuthType, googleId: string | null }) {
    this.id = user.id;
    this.name = user.name;
    this.email = user.email;
    this.isActivated = user.isActivated;
    this.authType = user.authType
    this.googleId = user.googleId
  }
}