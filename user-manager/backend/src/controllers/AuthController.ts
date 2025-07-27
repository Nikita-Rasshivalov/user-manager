import { Request, Response } from "express";
import { AuthService } from "../services/AuthService";

const authService = new AuthService();

export class AuthController {
  static async login(req: Request, res: Response) {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    const token = await authService.login(email, password);
    if (!token) {
      return res
        .status(401)
        .json({ message: "Invalid credentials or blocked user" });
    }

    return res.json({ token });
  }

  static async register(req: Request, res: Response) {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields required" });
    }

    try {
      const user = await authService.register(name, email, password);
      return res.status(201).json({ id: user?.id });
    } catch (error: any) {
      if (error.code === "ER_DUP_ENTRY") {
        return res.status(409).json({ message: "Email already exists" });
      }
      return res.status(500).json({ message: "Internal server error" });
    }
  }
}
