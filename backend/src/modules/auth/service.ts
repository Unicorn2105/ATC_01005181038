import { NextFunction, Request, RequestHandler, Response } from "express";
import { generateJWT } from "../../utils/security/jwt";
import UserRepository from "../../repository/userRepository";
import {
    asyncHandler,
    RequestError,
} from "../../utils/errorHandler/errorHandler";
import { SuccessResponse } from "../../utils/responses/responses";
import bcrypt from "bcrypt";

interface LoginPayload {
    email: string;
    password: string;
}

const login: RequestHandler = asyncHandler(
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const payload: LoginPayload = req.body;
        const user = await UserRepository.findOne({
            where: { email: payload.email },
        });
        if (
            !user?.password ||
            !bcrypt.compareSync(payload.password, user.password)
        ) {
            next(new RequestError("email or password is incorrect", 400));
            return;
        }

        user.password = undefined;
        const token = generateJWT(user);
        SuccessResponse(res, {
            data: { access_token: token, user },
            message: "User logged in successfully",
        });
        return;
    }
);

const register: RequestHandler = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const payload = req.body;
        const existingUser = await UserRepository.findOne({
            where: { email: payload.email },
        });
        if (existingUser) {
            next(new RequestError("User already exists", 400));
            return;
        }
        payload.password = await bcrypt.hash(payload.password, 10);
        await UserRepository.insert(payload);
        const user = await UserRepository.findOne({
            where: { email: payload.email },
        });
        user!.password = undefined;
        const token = generateJWT(user!);
        SuccessResponse(
            res,
            {
                data: { access_token: token, user },
                message: "User registered successfully",
            },
            201
        );
        return;
    }
);

const checkExistingUser: RequestHandler = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const { email } = req.query;
        const existingUser = await UserRepository.findOne({
            where: { email: email as string },
        });
        if (existingUser) {
            res.status(200).json({ isExist: true });
            return;
        }
        res.status(200).json({ isExist: false });
        return;
    }
);

export default { login, register, checkExistingUser };
