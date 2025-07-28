import { JwtService } from "./JwtService.ts";
import { UserRepository } from "../repositories/UserRepository.ts";
import { UserStatus } from "../models/User.ts";
import { User } from "../models/User.ts";
import { hashPassword, comparePasswords } from "../utils/hash.ts";
import { UserRegisterDTO } from "../dtos/UserRegisterDTO.ts";
import { UserLoginDTO } from "../dtos/UserLoginDTO.ts";
import { UserResponseDTO } from "../dtos/UserResponseDTO.ts";
import { isNonEmptyString, isValidEmail } from "../utils/validation.ts";

export class AuthService {
  private jwtService = JwtService.getInstance();
  private userRepository = new UserRepository();

  public async login(
    dto: UserLoginDTO
  ): Promise<{ token: string; user: UserResponseDTO } | null> {
    if (!isValidEmail(dto.email)) throw new Error("Invalid email format");
    if (!isNonEmptyString(dto.password))
      throw new Error("Password is required");

    const user = await this.userRepository.findByEmail(dto.email);
    if (!user) return null;

    const match = await comparePasswords(dto.password, user.password);
    if (!match) return null;

    if (
      user.status === UserStatus.BLOCKED ||
      user.status === UserStatus.DELETED
    ) {
      return null;
    }

    user.last_login = new Date();
    await this.userRepository.update(user);

    const token = this.jwtService.sign({
      userId: user.id!,
      email: user.email,
      status: user.status,
    });

    return {
      token,
      user: this.toUserResponseDTO(user),
    };
  }

  public async register(dto: UserRegisterDTO): Promise<UserResponseDTO> {
    if (!isNonEmptyString(dto.name))
      throw new Error("Name must be a non-empty string");
    if (!isValidEmail(dto.email)) throw new Error("Invalid email format");
    if (!isNonEmptyString(dto.password) || dto.password.length < 6) {
      throw new Error("Password must be at least 6 characters long");
    }

    const hashedPassword = await hashPassword(dto.password);
    const user = new User(
      dto.name,
      dto.email,
      hashedPassword,
      UserStatus.ACTIVE
    );
    const created = await this.userRepository.create(user);
    if (!created) throw new Error("User creation failed");

    return this.toUserResponseDTO(created);
  }

  private toUserResponseDTO(user: User): UserResponseDTO {
    return {
      id: user.id!,
      name: user.name,
      email: user.email,
      status: user.status,
      created_at: user.created_at,
      last_login: user.last_login ?? null,
    };
  }
}
