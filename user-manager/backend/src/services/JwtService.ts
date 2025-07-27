import jwt, { SignOptions } from "jsonwebtoken";
import { UserStatus } from "../models/User";

export interface JwtPayload {
  userId: number;
  email: string;
  status: UserStatus;
}

export class JwtService {
  private static instance: JwtService;
  private readonly secret: string;
  private readonly expiresIn: number;

  private constructor() {
    this.secret = process.env.JWT_SECRET || "default_jwt_secret";
    this.expiresIn = 3600;
  }

  public static getInstance(): JwtService {
    if (!JwtService.instance) {
      JwtService.instance = new JwtService();
    }
    return JwtService.instance;
  }

  public sign(payload: JwtPayload): string {
    const options: SignOptions = { expiresIn: this.expiresIn };
    return jwt.sign(payload, this.secret, options);
  }

  public verify(token: string): JwtPayload | null {
    try {
      const decoded = jwt.verify(token, this.secret);
      return decoded as JwtPayload;
    } catch (err) {
      console.error("JWT verification error:", err);
      return null;
    }
  }
}
