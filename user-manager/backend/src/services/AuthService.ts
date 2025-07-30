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
  ): Promise<{ token: string; user: UserResponseDTO }> {
    this.validateLoginDto(dto);

    const user = await this.findUserByEmail(dto.email);
    await this.validateUserCredentials(user, dto.password);

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

  private validateLoginDto(dto: UserLoginDTO) {
    if (!isValidEmail(dto.email)) throw new Error("Invalid email format");
    if (!isNonEmptyString(dto.password))
      throw new Error("Password is required");
  }

  private async findUserByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) throw new Error("Invalid credentials");
    return user;
  }

  private async validateUserCredentials(
    user: User,
    password: string
  ): Promise<void> {
    const match = await comparePasswords(password, user.password);
    if (!match) throw new Error("Invalid credentials");

    if (
      user.status === UserStatus.BLOCKED ||
      user.status === UserStatus.DELETED
    ) {
      throw new Error("User is blocked or deleted");
    }
  }

  private validateRegisterData(dto: UserRegisterDTO): void {
    if (!isNonEmptyString(dto.name))
      throw new Error("Name must be a non-empty string");
    if (!isValidEmail(dto.email)) throw new Error("Invalid email format");
    if (!isNonEmptyString(dto.password)) {
      throw new Error("Password is required");
    }
  }

  private async restoreDeletedUser(
    existingUser: User,
    dto: UserRegisterDTO
  ): Promise<UserResponseDTO> {
    existingUser.name = dto.name;
    existingUser.password = await hashPassword(dto.password);
    existingUser.status = UserStatus.ACTIVE;
    await this.userRepository.update(existingUser);
    return this.toUserResponseDTO(existingUser);
  }

  private async createNewUser(dto: UserRegisterDTO): Promise<UserResponseDTO> {
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

  public async register(dto: UserRegisterDTO): Promise<UserResponseDTO> {
    this.validateRegisterData(dto);

    const existingUser = await this.userRepository.findByEmailIncludeDeleted(
      dto.email
    );

    if (existingUser) {
      if (existingUser.status !== UserStatus.DELETED) {
        throw new Error("Email already registered");
      }
      return this.restoreDeletedUser(existingUser, dto);
    }

    return this.createNewUser(dto);
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

  public getJwtPayload(token: string): any | null {
    try {
      return this.jwtService.verify(token);
    } catch {
      return null;
    }
  }

  public async getUserById(id: number) {
    const user = await this.userRepository.findById(id);
    if (!user) return null;
    return this.toUserResponseDTO(user);
  }
}
