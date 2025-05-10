import { Router } from "express";
import AuthService from "./service";

const authRouter = Router();

authRouter.post("/login", AuthService.login);
authRouter.post("/register", AuthService.register);
export default authRouter;
