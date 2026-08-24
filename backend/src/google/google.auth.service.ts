import { prisma } from "../prisma.js";
import { IGoogleData } from "./IGoogleData.js";
import { UserDto } from "../user/user.dto.js";
import { TokenService } from "../token/token.service.js";
import { googleOAuth2Client } from "../config/google.js";
import { google } from "googleapis";
import { AppError } from "../utils/app-error.middleware.js";
import { User } from "@prisma/client";

export class GoogleService {
  constructor(private readonly tokenService: TokenService) {}
  async googleLogin(code: string) {
   const googleUser = await this.getGoogleUser(code);
   const user = await this.findOrCreateUser(googleUser);
    return this.authenticate(user);
  
  }
  private async getGoogleUser(code: string): Promise<IGoogleData> {
    const { tokens } = await googleOAuth2Client.getToken(code);
    googleOAuth2Client.setCredentials(tokens);

    const oAuth2 = google.oauth2({
      auth: googleOAuth2Client,
      version: "v2",
    });

    const { data } = await oAuth2.userinfo.get();
    if (
      !data.id ||
      !data.name ||
      !data.email ||
      data.verified_email !== true
    ) {
      throw AppError.BadRequest("Google user data is missing");
    }

    return {
      googleId: data.id,
      name: data.name,
      email: data.email,
    };
  }

  private async findOrCreateUser(data: IGoogleData) {
   let user = await prisma.user.findUnique({
      where: {
        googleId: data.googleId,
      },
    });

    if (!user) {
      user = await prisma.user.findUnique({
        where: {
          email: data.email,
        },
      });
    }
    if (!user) {
      user = await prisma.user.create({
        data: {
          name: data.name,
          email: data.email,
          googleId: data.googleId,
          isActivated: true,
        },
      });
    } 
     if (!user.googleId) {
      user = await prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          googleId: data.googleId,
        },
      });
    }

    return user;
  }

  private async authenticate(user: User){
    const userDto = new UserDto(user);
    const tokens = this.tokenService.generateTokens({ ...userDto });
    await this.tokenService.saveToken(userDto.id, tokens.refreshToken);

    return {
      ...tokens,
      user: userDto,
    };
  }
}
