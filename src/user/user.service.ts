import { User } from "@prisma/client";
import { IUser } from "./user.type.js";
import { prisma } from "../prisma.js";
import { logger } from "../utils/log.js";
import bcrypt from "bcrypt";
import { CreateUserDto } from "./create-user.dto.js";
import { UpdateUserDto } from "./update-user.dto.js";
import { AppError } from "../utils/app-error.middleware.js";
import { v4 as uuidv4 } from "uuid";
import { EmailService } from "../email/email.service.js";
import { TokenService } from "../token/token.service.js";
import { UserDto } from "./user.dto.js";
import { AuthReponse } from "./auth-response.js";

export class UserService {
  constructor(
    private readonly emailService: EmailService,
    private readonly tokenService: TokenService,
  ) {}

  async getUsers(): Promise<User[]> {
    return await prisma.user.findMany();
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

    await this.emailService.sendActivationMail(data.email, activationLink);
    
    const userDto = new UserDto(user)
    const tokens = this.tokenService.generateTokens({...userDto})
    
    await this.tokenService.saveToken(user.id, tokens.refreshToken)
    return {
      ...tokens,
      user: userDto
    }
  }

  async login() {
    try {
    } catch (e: any) {}
  }

  async logout() {}

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
