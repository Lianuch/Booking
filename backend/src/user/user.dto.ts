export class UserDto {
    id: string;
    name: string;
    email: string;
    isActivated: boolean;
    
   constructor(user: { id: string; name: string; email: string; isActivated: boolean }) {
    this.id = user.id;
    this.name = user.name;
    this.email = user.email;
    this.isActivated = user.isActivated;
  }
}