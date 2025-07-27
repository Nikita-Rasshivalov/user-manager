import { UserRepository } from "../repositories/UserRepository";
import { UserRegisterDTO } from "../dtos/UserRegisterDTO";
import { UserLoginDTO } from "../dtos/UserLoginDTO";
import { UserResponseDTO } from "../dtos/UserResponseDTO";
import { User, UserStatus } from "../models/User";
import { hashPassword, comparePasswords } from "../utils/hash";
import { isNonEmptyString, isValidEmail } from "../utils/validation";

export class UserService {
  private userRepo = new UserRepository();

  async register(dto: UserRegisterDTO): Promise<UserResponseDTO> {
    if (!isNonEmptyString(dto.name))
      throw new Error("Name must be non-empty string");
    if (!isValidEmail(dto.email)) throw new Error("Invalid email");
    if (!isNonEmptyString(dto.password))
      throw new Error("Password must be non-empty string");

    const hashed = await hashPassword(dto.password);

    const newUser = new User(dto.name, dto.email, hashed, UserStatus.ACTIVE);
    const createdUser = await this.userRepo.create(newUser);
    if (!createdUser) throw new Error("User creation failed");

    return this.toUserResponseDTO(createdUser);
  }

  async login(dto: UserLoginDTO): Promise<UserResponseDTO> {
    if (!isValidEmail(dto.email)) throw new Error("Invalid email");
    if (!isNonEmptyString(dto.password))
      throw new Error("Password must be non-empty string");

    const user = await this.userRepo.findByEmail(dto.email);
    if (!user) throw new Error("Invalid email or password");
    if (user.status === UserStatus.BLOCKED) throw new Error("User blocked");

    const match = await comparePasswords(dto.password, user.password);
    if (!match) throw new Error("Invalid email or password");

    // Обновляем last_login
    user.last_login = new Date();
    await this.userRepo.update(user);

    return this.toUserResponseDTO(user);
  }

  async getAllUsers(): Promise<UserResponseDTO[]> {
    const users = await this.userRepo.getAllUsersSorted();
    return users.map((user) => this.toUserResponseDTO(user));
  }

  async blockUsers(ids: number[]): Promise<void> {
    for (const id of ids) {
      await this.userRepo.updateStatus(id, UserStatus.BLOCKED);
    }
  }

  async unblockUsers(ids: number[]): Promise<void> {
    for (const id of ids) {
      await this.userRepo.updateStatus(id, UserStatus.ACTIVE);
    }
  }

  async deleteUsers(ids: number[]): Promise<void> {
    for (const id of ids) {
      await this.userRepo.deleteUser(id);
    }
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
