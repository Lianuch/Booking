import { type AxiosResponse } from "axios";
import $api from "../http";
import { type AuthResponse } from "../models/response/authResponse";

export class AuthService {
  static async login(
    email: string,
    password: string,
  ): Promise<AxiosResponse<AuthResponse>> {
    return $api.post("/auth/login", { email, password });
  }
  static async register(
    name: string,
    email: string,
    password: string,
  ): Promise<AxiosResponse<AuthResponse>> {
    return $api.post("/auth/register", { name, email, password });
  }
  static async logout(): Promise<void> {
    return $api.post("/auth/logout");
  }
}
