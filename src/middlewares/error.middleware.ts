import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/app-error.middleware.js";
import { logger } from "../utils/log.js";

export const errorMiddleware = (err: AppError, req: Request, res: Response, next: NextFunction) => {

    if(err instanceof AppError){
        return res.status(err.statusCode).json({message: err.message, errors: err.errors});
    }
     logger.error("Unexpected error:", err);

    return res.status(500).json({message: "Internal server error"});
}
     