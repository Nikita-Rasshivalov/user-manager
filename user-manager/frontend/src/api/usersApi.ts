import { UserResponse } from "../models/models";
import axiosInstance from "../services/axiosInstance";

class UsersApi {
  async getAllUsers(): Promise<UserResponse[]> {
    const response = await axiosInstance.get<UserResponse[]>("/users");
    return response.data;
  }
  async blockUsers(ids: number[]): Promise<void> {
    await axiosInstance.post("/users/block", { ids });
  }

  async unblockUsers(ids: number[]): Promise<void> {
    await axiosInstance.post("/users/unblock", { ids });
  }

  async deleteUsers(ids: number[]): Promise<void> {
    await axiosInstance.post("/users/delete", { ids });
  }
}

export default new UsersApi();
