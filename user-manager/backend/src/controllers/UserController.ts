import { Request, Response } from "express";
import { UserService } from "../services/UserService";
import { BaseController } from "./BaseController";

const userService = new UserService();

export class UserController extends BaseController {
  async register(req: Request, res: Response) {
    await this.handle(res, () => userService.register(req.body), 201);
  }

  async login(req: Request, res: Response) {
    await this.handle(res, () => userService.login(req.body), 200);
  }

  async getAllUsers(req: Request, res: Response) {
    await this.handle(res, () => userService.getAllUsers(), 200);
  }

  async blockUsers(req: Request, res: Response) {
    await this.handle(res, async () => {
      const ids: number[] = req.body.ids;
      await userService.blockUsers(ids);
      return { message: "Users blocked successfully" };
    });
  }

  async unblockUsers(req: Request, res: Response) {
    await this.handle(res, async () => {
      const ids: number[] = req.body.ids;
      await userService.unblockUsers(ids);
      return { message: "Users unblocked successfully" };
    });
  }

  async deleteUsers(req: Request, res: Response) {
    await this.handle(res, async () => {
      const ids: number[] = req.body.ids;
      await userService.deleteUsers(ids);
      return { message: "Users deleted successfully" };
    });
  }
}
