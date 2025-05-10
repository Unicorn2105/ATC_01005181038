import { NextFunction, Request, Response } from "express";
import { verifyJWT } from "../utils/security/jwt";
import { unauthorizedError } from "../utils/errorHandler/errorHandler";
import UserRepository from "../repository/userRepository";
import { asyncHandler } from "../utils/errorHandler/errorHandler";

export const authMiddleware = (role?: string) =>
    asyncHandler(
        async (
            req: Request,
            res: Response,
            next: NextFunction
        ): Promise<void> => {
            const token = req.headers.authorization?.split(" ")[1];
            console.log("token", token);
            if (!token) {
                next(unauthorizedError());
                return;
            }
            let decoded;
            try {
                decoded = verifyJWT(token);
                if (!decoded) {
                    next(unauthorizedError());
                    return;
                }
            } catch (error) {
                next(unauthorizedError());
                return;
            }

            const user = await UserRepository.findOne({
                where: { id: decoded.id },
            });
            if (!user) {
                next(unauthorizedError());
                return;
            }
            if (role && user.role !== role) {
                next(unauthorizedError());
                return;
            }

            req.user = user;
            next();
        }
    );
