import { Router } from "express";
import { UserController } from "../controllers/UserController.ts";
import { authMiddleware } from "../middleware/authMiddleware.ts";

const userController = new UserController();
const router = Router();

router.get("/", authMiddleware, (req, res) =>
  userController.getAllUsers(req, res)
);
router.post("/block", authMiddleware, (req, res) =>
  userController.blockUsers(req, res)
);
router.post("/unblock", authMiddleware, (req, res) =>
  userController.unblockUsers(req, res)
);
router.post("/delete", authMiddleware, (req, res) =>
  userController.deleteUsers(req, res)
);

export default router;
