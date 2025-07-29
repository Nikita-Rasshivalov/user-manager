import {
  RegisterDTO,
  UserResponse,
  LoginDTO,
  LoginResponse,
} from "../models/models";
import axiosInstance from "../services/axiosInstance";

export class AuthApi {
  static async register(data: RegisterDTO): Promise<UserResponse> {
    const response = await axiosInstance.post<UserResponse>(
      "/auth/register",
      data
    );
    return response.data;
  }

  static async login(data: LoginDTO): Promise<LoginResponse> {
    const response = await axiosInstance.post<LoginResponse>(
      "/auth/login",
      data
    );
    return response.data;
  }

  static async getCurrentUser(): Promise<UserResponse> {
    const response = await axiosInstance.get<UserResponse>("/auth/me");
    return response.data;
  }
}
