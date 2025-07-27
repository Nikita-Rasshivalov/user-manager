import { Request, Response } from "express";
import { UserService } from "../services/UserService";
import { sendErrorResponse } from "../utils/errorHandler";
const userService = new UserService();

export class UserController {
  async register(req: Request, res: Response) {
    try {
      const userResponse = await userService.register(req.body);
      res.status(201).json(userResponse);
    } catch (error) {
      sendErrorResponse(res, error, 400);
    }
  }

  async login(req: Request, res: Response) {
    try {
      const userResponse = await userService.login(req.body);
      res.status(200).json(userResponse);
    } catch (error) {
      sendErrorResponse(res, error, 401);
    }
  }

  async getAllUsers(req: Request, res: Response) {
    try {
      const users = await userService.getAllUsers();
      res.status(200).json(users);
    } catch (error) {
      sendErrorResponse(res, error, 500);
    }
  }

  async blockUsers(req: Request, res: Response) {
    try {
      const ids: number[] = req.body.ids;
      await userService.blockUsers(ids);
      res.status(200).json({ message: "Users blocked successfully" });
    } catch (error) {
      sendErrorResponse(res, error, 400);
    }
  }

  async unblockUsers(req: Request, res: Response) {
    try {
      const ids: number[] = req.body.ids;
      await userService.unblockUsers(ids);
      res.status(200).json({ message: "Users unblocked successfully" });
    } catch (error) {
      sendErrorResponse(res, error, 400);
    }
  }

  async deleteUsers(req: Request, res: Response) {
    try {
      const ids: number[] = req.body.ids;
      await userService.deleteUsers(ids);
      res.status(200).json({ message: "Users deleted successfully" });
    } catch (error) {
      sendErrorResponse(res, error, 400);
    }
  }
}
