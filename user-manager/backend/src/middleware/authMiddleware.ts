import { Request, Response, NextFunction } from "express";
import { JwtService } from "../services/JwtService";
import { UserRepository } from "../repositories/UserRepository";

export async function authMiddleware(
  req: Request,
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
  if (!user || user.status === 1 || user.status === 2) {
    return res
      .status(401)
      .json({ message: "Unauthorized: User blocked or deleted" });
  }

  (req as any).user = user;

  next();
}
