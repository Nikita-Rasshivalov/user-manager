import { Request, Response } from "express";
import { AuthService } from "../services/AuthService.ts";
import { BaseController } from "./BaseController.ts";
import { UserLoginDTO } from "../dtos/UserLoginDTO.ts";
import { UserRegisterDTO } from "../dtos/UserRegisterDTO.ts";

const authService = new AuthService();

export class AuthController extends BaseController {
  login = async (req: Request, res: Response) => {
    await this.handle(res, async () => {
      const dto: UserLoginDTO = {
        email: req.body.email,
        password: req.body.password,
      };

      const result = await authService.login(dto);
      if (!result) {
        throw new Error("Invalid credentials or blocked/deleted user");
      }

      return {
        token: result.token,
        user: result.user,
      };
    });
  };

  register = async (req: Request, res: Response) => {
    console.log("Login request body:", req.body);
    await this.handle(
      res,
      async () => {
        const dto: UserRegisterDTO = {
          name: req.body.name,
          email: req.body.email,
          password: req.body.password,
        };

        const user = await authService.register(dto);
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          status: user.status,
          created_at: user.created_at,
        };
      },
      201
    );
  };

  me = async (req: Request, res: Response) => {
    await this.handle(res, async () => {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        throw new Error("Authorization header missing or invalid");
      }
      const token = authHeader.split(" ")[1];

      const payload = authService.getJwtPayload(token);
      if (!payload || !payload.userId) {
        throw new Error("Invalid token");
      }

      const user = await authService.getUserById(payload.userId);
      if (!user) {
        throw new Error("User not found");
      }

      return {
        user,
      };
    });
  };
}
