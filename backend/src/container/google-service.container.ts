import { GoogleService } from "../google/google.auth.service.js";
import { TokenService } from "../token/token.service.js";

const tokenService = new TokenService();
export const googleService = new GoogleService(tokenService);
