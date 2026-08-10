import "dotenv/config";
import jwt from "jsonwebtoken";
import { AppError } from "../utils/app-error.middleware.js";
import { prisma } from "../prisma.js";
import { Token } from "@prisma/client";
import { UserDto } from "../user/user.dto.js";
import { TokenPayload } from "./token-payload.js";
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
      data: {
        userId,
        refreshToken,
      },
    });
    return token;
  }

  async removeToken(refreshToken: string) {
    const tokenData = await prisma.token.delete({
      where: { refreshToken },
    });
    return tokenData;
  }

   validateAccessToken(token: string) {
    try {
      const userData = jwt.verify(
        token,
        process.env.JWT_ACCESS_SECRET as string,
      );

      return userData;
    } catch (e) {
      return null;
    }
  }
   validateRefreshToken(token: string) {
    try {
      const userData = jwt.verify(token, process.env.JWT_REFRESH_SECRET as string);
      return userData as TokenPayload;
    } catch (e) {
      return null;
    }
  }

  async findToken(refreshToken: string){
    const tokenData = await prisma.token.findUnique({
      where: { refreshToken },
    })
    return tokenData;
  }
}
