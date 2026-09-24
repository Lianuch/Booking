import { AuthType, Role } from "@prisma/client";

export class UserDto {
    id: string;
    name: string;
    email: string;
    isActivated: boolean;
    authType: AuthType;
    googleId: string | null;
    role: Role;
    
   constructor(user: { id: string; name: string; email: string; isActivated: boolean, authType: AuthType, googleId: string | null, role: Role }) {
    this.id = user.id;
    this.name = user.name;
    this.email = user.email;
    this.isActivated = user.isActivated;
    this.authType = user.authType
    this.googleId = user.googleId
    this.role = user.role;
  }
}