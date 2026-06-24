import { User } from "@prisma/client";
import { IUser } from "./user.type.js";
import { prisma } from "../prisma.js";
import { logger } from "../utils/log.js";
import bcrypt from "bcrypt";
import { CreateUserDto } from "./create-user.dto.js";
import { UpdateUserDto } from "./update-user.dto.js";
import { AppError } from "../utils/app-error.middleware.js";
export class UserService {

    async getUsers(): Promise<IUser[]> {
        return await prisma.user.findMany();
    }

    async getUserById(id: string): Promise<User> {
        const user = await prisma.user.findUnique({
            where: {id}
        })
        if(!user){
            logger.warn(`User not found: ${id}`);
            throw AppError.BadRequest("User not found");
        }
        return user;
    }

    async createUser(data: CreateUserDto): Promise<User> {
        await prisma.user.findUnique({
            where: {
                email: data.email
            }
        })
       
       const hashedPassword = await bcrypt.hash(data.password, 10);

       const user =  await prisma.user.create({
        data: {
            name: data.name,
            email: data.email,
            password: hashedPassword,
        }
       })
     return user;
    }

    // async changeUserRole(userId: string, role: Role): Promise<User>{

    // }

    async deleteUser(id: string): Promise<User> {
        await this.getUserById(id);
    
        return await prisma.user.delete({
            where: {id}
        })
    }

    async updateUser(id: string, data: UpdateUserDto): Promise<User>{
        await this.getUserById(id);

        const updatedData: any = {...data} as Partial<UpdateUserDto>

        if(data.password){
            updatedData.password = await bcrypt.hash(data.password, 10);
        }
        const user = await prisma.user.update({
            where: {id},
            data: updatedData
        })

        return user;

    }


}