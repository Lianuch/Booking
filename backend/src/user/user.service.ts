import { User } from "@prisma/client";
import { prisma } from "../prisma.js";
import { logger } from "../utils/log.js";
import { CreateUserDto } from "./create-user.dto.js";
import { UpdateUserDto } from "./update-user.dto.js";
import { AppError } from "../utils/app-error.middleware.js";
import { EmailService } from "../email/email.service.js";
import { TokenService } from "../token/token.service.js";
import { UserDto } from "./user.dto.js";
import { AuthReponse } from "./auth-response.js";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcrypt";
import { NextFunction } from "express";

export class UserService {
  constructor(
    private readonly emailService: EmailService,
    private readonly tokenService: TokenService,
  ) {}

  async getUsers(): Promise<User[]> {
    const users = await prisma.user.findMany();
    return users;
  }

  async getUserById(id: string): Promise<User> {
    const user = await prisma.user.findUnique({
      where: { id },
    });
    if (!user) {
      logger.warn(`User not found: ${id}`);
      throw AppError.BadRequest("User not found");
    }
    return user;
  }

  async registration(data: CreateUserDto): Promise<AuthReponse> {
    const existingUser = await prisma.user.findUnique({
      where: {
        email: data.email,
      },
    });

    if (existingUser) {
      logger.warn(`User already exists: ${data.email}`);
      throw AppError.BadRequest("User already exists");
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);
    const activationLink: string = uuidv4();

    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
        activationLink,
      },
    });

    await this.emailService.sendActivationMail(
      data.email,
      `${process.env.API_URL}/api/auth/activate/${activationLink}`,
    );

    const userDto = new UserDto(user);
    const tokens = this.tokenService.generateTokens({ ...userDto });

    await this.tokenService.saveToken(user.id, tokens.refreshToken);
    return {
      ...tokens,
      user: userDto,
    };
  }

  async activate(activationLink: string): Promise<void> {
    const user = await prisma.user.findFirst({
      where: { activationLink },
    });
    if (!user) {
      logger.warn(`User not found: ${activationLink}`);
      throw AppError.BadRequest("Invalid activation link");
    }
    user.isActivated = true;
    await prisma.user.update({
      where: { id: user.id },
      data: { isActivated: true },
    });
  }

  async login(email: string, password: string) {
    const userData = await prisma.user.findUnique({
      where: { email },
    });

    if (!userData) {
      logger.warn(`User not found: ${email}`);
      throw AppError.BadRequest("User not found");
    }
    const isPassEqualt = await bcrypt.compare(password, userData.password);

    if (!isPassEqualt) {
      logger.warn(`Invalid password for user: ${email}`);
      throw AppError.BadRequest("Invalid password");
    }

    const userDto = new UserDto(userData);
    const tokens = this.tokenService.generateTokens({ ...userDto });
    await this.tokenService.saveToken(userDto.id, tokens.refreshToken);
    return {
      ...tokens,
      user: userDto,
    };
  }

  async logout(refreshToken: string) {
    const token = await this.tokenService.removeToken(refreshToken);
    return token;
  }

  async refresh(refreshToken: string) {
    if (!refreshToken) {
      throw AppError.UnauthorizedError();
    }

    const userData =  this.tokenService.validateRefreshToken(refreshToken);
    const tokenFromDB = await this.tokenService.findToken(refreshToken);

    if(!userData || !tokenFromDB) {
      throw AppError.UnauthorizedError();
    }

    const user = await prisma.user.findUnique({
      where: { id: userData.id },
    });

    const userDto = new UserDto(user as User);
    const tokens = this.tokenService.generateTokens({ ...userDto });
    await this.tokenService.saveToken(userDto.id, tokens.refreshToken);
    return {
      ...tokens,
      user: userDto,
    }
  }

  async deleteUser(id: string): Promise<User> {
    await this.getUserById(id);

    return await prisma.user.delete({
      where: { id },
    });
  }

  async updateUser(id: string, data: UpdateUserDto): Promise<User> {
    await this.getUserById(id);

    const updatedData: any = { ...data } as Partial<UpdateUserDto>;

    if (data.password) {
      updatedData.password = await bcrypt.hash(data.password, 10);
    }
    const user = await prisma.user.update({
      where: { id },
      data: updatedData,
    });

    return user;
  }



}
