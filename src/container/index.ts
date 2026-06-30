import { EmailService } from "../email/email.service.js";
import { TokenService } from "../token/token.service.js";
import { UserService } from "../user/user.service.js";

const emailService = new EmailService();
const tokenService = new TokenService();

export const userService = new UserService(emailService, tokenService);