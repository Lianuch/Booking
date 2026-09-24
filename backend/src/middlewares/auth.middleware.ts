import { TokenService } from "../token/token.service.js";
import { AppError } from "../utils/app-error.middleware.js";
import { NextFunction, Request, Response, Router } from "express";


export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return next(AppError.UnauthorizedError());
    }
    const [type, accessToken] = authHeader.split(" ");
    if (type !== "Bearer" || !accessToken) {
      return next(AppError.UnauthorizedError());
    }

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
