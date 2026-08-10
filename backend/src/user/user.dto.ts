export class UserDto {
    id: string;
    email: string;
    isActivated: boolean;
    
   constructor(user: { id: string; email: string; isActivated: boolean }) {
    this.id = user.id;
    this.email = user.email;
    this.isActivated = user.isActivated;
  }
}