import { Request, Response, NextFunction } from "express";
import { JwtService } from "../services/JwtService";
import { UserRepository } from "../repositories/UserRepository";
import { User, UserStatus } from "../models/User";

export interface AuthRequest extends Request {
  user?: User;
}

export async function authMiddleware(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  const token = authHeader.split(" ")[1];
  const jwtService = JwtService.getInstance();
  const payload = jwtService.verify(token);
  if (!payload) {
    return res.status(401).json({ message: "Unauthorized: Invalid token" });
  }

  const userRepo = new UserRepository();
  const user = await userRepo.findById(payload.userId);
  if (
    !user ||
    user.status === UserStatus.BLOCKED ||
    user.status === UserStatus.DELETED
  ) {
    return res
      .status(401)
      .json({ message: "Unauthorized: User blocked or deleted" });
  }
  req.user = user;
  next();
}
