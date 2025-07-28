import { Request, Response } from "express";
import { UserService } from "../services/UserService.ts";
import { BaseController } from "./BaseController.ts";
import { AuthRequest } from "../Requests/AuthRequest.ts";

const userService = new UserService();

export class UserController extends BaseController {
  getAllUsers = async (req: Request, res: Response) => {
    await this.handle(res, () => userService.getAllUsers(), 200);
  };

  blockUsers = async (req: AuthRequest, res: Response) => {
    await this.handle(res, async () => {
      const ids: number[] = req.body.ids;
      await userService.blockUsers(ids);

      const selfBlocked = req.user && ids.includes(req.user.id!);
      return { message: "Users blocked successfully", selfBlocked };
    });
  };

  unblockUsers = async (req: AuthRequest, res: Response) => {
    await this.handle(res, async () => {
      const ids: number[] = req.body.ids;
      await userService.unblockUsers(ids);
      return { message: "Users unblocked successfully" };
    });
  };

  deleteUsers = async (req: AuthRequest, res: Response) => {
    await this.handle(res, async () => {
      const ids: number[] = req.body.ids;
      await userService.deleteUsers(ids);
      return { message: "Users deleted successfully" };
    });
  };
}
