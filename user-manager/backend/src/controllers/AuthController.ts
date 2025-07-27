import { Request, Response } from "express";
import { AuthService } from "../services/AuthService";
import { BaseController } from "./BaseController";

const authService = new AuthService();

export class AuthController extends BaseController {
  async login(req: Request, res: Response) {
    await this.handle(res, async () => {
      const { email, password } = req.body;
      if (!email || !password) {
        throw new Error("Email and password required");
      }

      const token = await authService.login(email, password);
      if (!token) {
        throw new Error("Invalid credentials or blocked user");
      }

      return { token };
    });
  }

  async register(req: Request, res: Response) {
    await this.handle(
      res,
      async () => {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
          throw new Error("All fields required");
        }

        const user = await authService.register(name, email, password);
        return { id: user?.id };
      },
      201
    );
  }
}
