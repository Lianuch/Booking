import { Role } from "@prisma/client";

export class UserTokenDto {
  id: string;
  email: string;
  isActivated: boolean;
  role: Role;

  constructor(user: {
    id: string;
    email: string;
    isActivated: boolean;
    role: Role;
  }) {
    this.id = user.id;
    this.email = user.email;
    this.isActivated = user.isActivated;
    this.role = user.role;
  }
}
