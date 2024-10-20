import { Router } from "express";
import {
  logout,
  signIn,
  signUp,
  verifyEmail,
  forgotPassword,
  resetPassword,
  checkAuth
} from "../controllers/auth.controller.js";
import { verifyToken } from "../middlewares/verify-token.js";

const authRouter = Router();

authRouter.get("/check_auth", verifyToken, checkAuth);
authRouter.post("/sign_up", signUp);
authRouter.post("/verify_email", verifyEmail);
authRouter.post("/sign_in", signIn);
authRouter.get("/logout", logout);
authRouter.post("/forgot_password", forgotPassword);
authRouter.post("/forgot_password/:token", resetPassword);

export default authRouter;
