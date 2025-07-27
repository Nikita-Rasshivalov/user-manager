import { Router } from "express";
import { UserController } from "../controllers/UserController";

const userController = new UserController();
const router = Router();

router.post("/register", (req, res) => userController.register(req, res));
router.post("/login", (req, res) => userController.login(req, res));
router.get("/", (req, res) => userController.getAllUsers(req, res));
router.post("/block", (req, res) => userController.blockUsers(req, res));
router.post("/unblock", (req, res) => userController.unblockUsers(req, res));
router.post("/delete", (req, res) => userController.deleteUsers(req, res));

export default router;
