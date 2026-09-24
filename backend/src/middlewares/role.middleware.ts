import { Role } from "@prisma/client"
import { NextFunction, Request, Response, Router } from "express";
import { AppError } from "../utils/app-error.middleware.js";

export const requireRole = (role: Role) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if(!req.user){
            return next(AppError.UnauthorizedError());
        }
        if(req.user.role !== role){
            return next(AppError.ForbiddenError());
        }
        next();
    }
}