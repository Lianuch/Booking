import { TokenPayload } from "../token/token-payload.js";
import { TokenService } from "../token/token.service.js";
import { AppError } from "../utils/app-error.middleware.js";

export const authMiddleware = (req: any, res: any, next: any) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return next(AppError.UnauthorizedError());
    }

    const accessToken = authHeader.split(" ")[1];
    if (!accessToken) {
      return next(AppError.UnauthorizedError());
    }
    const tokenService = new TokenService();

    const userData = tokenService.validateAccessToken(accessToken);
    if (!userData) {
      return next(AppError.UnauthorizedError());
    }
    req.user = userData;
    next();
  } catch (e) {
    next(AppError.UnauthorizedError());
  }
};
