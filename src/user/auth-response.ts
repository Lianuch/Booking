import { UserDto } from "./user.dto.js"

export type AuthReponse = {
    accessToken: string,
    refreshToken: string
    user: UserDto;
}