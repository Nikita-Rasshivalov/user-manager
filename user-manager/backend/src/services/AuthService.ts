import { JwtService } from "./JwtService";
import { UserRepository } from "../repositories/UserRepository";
import { UserStatus } from "../models/User";
import { User } from "../models/User";

export class AuthService {
  private jwtService = JwtService.getInstance();
  private userRepository = new UserRepository();

  public async login(email: string, password: string): Promise<string | null> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) return null;

    if (user.password !== password) return null;

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

    return token;
  }

  public async register(
    name: string,
    email: string,
    password: string
  ): Promise<User | null> {
    const user = new User(name, email, password, UserStatus.ACTIVE);
    return await this.userRepository.create(user);
  }
}
