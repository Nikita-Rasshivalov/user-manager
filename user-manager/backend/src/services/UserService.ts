import { UserRepository } from "../repositories/UserRepository.ts";
import { UserRegisterDTO } from "../dtos/UserRegisterDTO.ts";
import { UserLoginDTO } from "../dtos/UserLoginDTO.ts";
import { UserResponseDTO } from "../dtos/UserResponseDTO.ts";
import { User, UserStatus } from "../models/User.ts";
import { hashPassword, comparePasswords } from "../utils/hash.ts";
import { isNonEmptyString, isValidEmail } from "../utils/validation.ts";

export class UserService {
  private userRepo = new UserRepository();

  async register(dto: UserRegisterDTO): Promise<UserResponseDTO> {
    if (!isNonEmptyString(dto.name))
      throw new Error("Name must be a non-empty string");
    if (!isValidEmail(dto.email)) throw new Error("Invalid email format");
    if (!isNonEmptyString(dto.password) || dto.password.length < 6)
      throw new Error("Password must be at least 6 characters long");

    const hashed = await hashPassword(dto.password);

    const newUser = new User(dto.name, dto.email, hashed, UserStatus.ACTIVE);
    const createdUser = await this.userRepo.create(newUser);
    if (!createdUser) throw new Error("User creation failed");

    return this.toUserResponseDTO(createdUser);
  }

  async login(dto: UserLoginDTO): Promise<UserResponseDTO> {
    if (!isValidEmail(dto.email)) throw new Error("Invalid email format");
    if (!isNonEmptyString(dto.password))
      throw new Error("Password must be a non-empty string");

    const user = await this.userRepo.findByEmail(dto.email);
    if (!user) throw new Error("Invalid email or password");
    if (user.status === UserStatus.BLOCKED) throw new Error("User is blocked");

    const isMatch = await comparePasswords(dto.password, user.password);
    if (!isMatch) throw new Error("Invalid email or password");

    user.last_login = new Date();
    await this.userRepo.update(user);

    return this.toUserResponseDTO(user);
  }

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
