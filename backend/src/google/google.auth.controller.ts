import { NextFunction, Request, Response, Router } from "express";
import { asyncHandler } from "../middlewares/asyncHandler.middleware.js";
import { googleOAuth2Client } from "../config/google.js";
import { AppError } from "../utils/app-error.middleware.js";
import { googleService } from "../container/google-service.container.js";

const router = Router();

router.get(
  "/",
  asyncHandler(async (req: Request, res: Response) => {
    const authorizeUrl = googleOAuth2Client.generateAuthUrl({
      access_type: "offline",
      scope: ["openid", "email", "profile"],
      include_granted_scopes: true,
    });

    res.redirect(authorizeUrl);
  }),
);

router.get(
  "/callback",
  asyncHandler(async (req: Request, res: Response) => {
    const { code } = req.query;
    if (!code || typeof code !== "string") {
      return AppError.BadRequest("Google authorization code is missing");
    }

    const authResponse = await googleService.googleLogin(code);
    res.cookie("refreshToken", authResponse.refreshToken, {
      maxAge: 30 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });
    res.redirect(process.env.CLIENT_URL || "http://localhost:5000");
  }),
);

export default router;
