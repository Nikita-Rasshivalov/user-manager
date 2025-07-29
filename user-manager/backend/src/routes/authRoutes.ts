import { Router } from "express";
import { AuthController } from "../controllers/AuthController.ts";

const router = Router();

const authController = new AuthController();
router.post("/login", authController.login);
router.post("/register", authController.register);
router.get("/me", authController.me);

export default router;
