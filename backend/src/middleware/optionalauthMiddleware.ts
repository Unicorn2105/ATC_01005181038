import { NextFunction, Request, Response } from "express";
import { verifyJWT } from "../utils/security/jwt";
import UserRepository from "../repository/userRepository";
import { asyncHandler } from "../utils/errorHandler/errorHandler";

export const optionalAuthMiddleware = asyncHandler(
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) {
            return next(); // No token → unauthenticated but allowed
        }

        try {
            const decoded = verifyJWT(token);
            if (!decoded) {
                return next(); // Invalid token → skip user
            }

            const user = await UserRepository.findOne({
                where: { id: decoded.id },
            });

            if (user) {
                req.user = user; // Attach user to request
            }
        } catch (error) {
            // Token error → continue as unauthenticated
        }

        next(); // Always allow the request to proceed
    }
);
