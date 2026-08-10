import { type AxiosResponse } from "axios";
import { type IUser } from "../models/response/IUser";
import $api from "../http";

export class UserService {
  static fetchUsers(): Promise<AxiosResponse<IUser[]>> {
    return $api.get<IUser[]>("/user");
  }
}
