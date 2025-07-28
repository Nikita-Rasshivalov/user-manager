import { UserRepository } from "../repositories/UserRepository.ts";
import { UserResponseDTO } from "../dtos/UserResponseDTO.ts";
import { User, UserStatus } from "../models/User.ts";

export class UserService {
  private userRepo = new UserRepository();

  async getAllUsers(): Promise<UserResponseDTO[]> {
    const users = await this.userRepo.getAllUsersSorted();
    return users.map((user) => this.toUserResponseDTO(user));
  }

  async blockUsers(ids: number[]): Promise<void> {
    await this.userRepo.updateStatusBulk(ids, UserStatus.BLOCKED);
  }

  async unblockUsers(ids: number[]): Promise<void> {
    await this.userRepo.updateStatusBulk(ids, UserStatus.ACTIVE);
  }

  async deleteUsers(ids: number[]): Promise<void> {
    await this.userRepo.updateStatusBulk(ids, UserStatus.DELETED);
  }

  private toUserResponseDTO(user: User): UserResponseDTO {
    return {
      id: user.id!,
      name: user.name,
      email: user.email,
      status: user.status,
      last_login: user.last_login ?? null,
      created_at: user.created_at,
    };
  }
}
