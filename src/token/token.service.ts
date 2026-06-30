import "dotenv/config";
import jwt from "jsonwebtoken";
import { AppError } from "../utils/app-error.middleware.js";
import { prisma } from "../prisma.js";
import { Token } from "@prisma/client";
export class TokenService {
  generateTokens(payload: any) {
    const access_secret = process.env.JWT_ACCESS_SECRET;
    const refresh_secret = process.env.JWT_REFRESH_SECRET;

    if (!access_secret || !refresh_secret) {
      throw new AppError(500, "Secrets are not defined");
    }

    const accessToken = jwt.sign(payload, access_secret, { expiresIn: "15m" });
    const refreshToken = jwt.sign(payload, refresh_secret, {
      expiresIn: "30d",
    });

    return { accessToken, refreshToken };
  }

  async saveToken(userId: string, refreshToken: string) {
    const tokenData = await prisma.token.findUnique({
      where: { userId },
    });
    if (tokenData) {
      return await prisma.token.update({
        where: { userId },
        data: { refreshToken },
      });
    }
    const token = await prisma.token.create({
        data:{
            userId,
            refreshToken
        }
    })
    return token;
  }
}
