import { JwtPayload } from "jsonwebtoken"
import { NextFunction, Request, Response } from "express";
import AppError from "../errorHelpers/AppError";
import { envVars } from "../config/env";
import { verifyToken } from "../modules/auth/jwt";


export const checkAuth = (...authRoles: string[]) => async (req: Request, res: Response, next: NextFunction) => {
    try {
        const accessToken = req.headers.authorization;

        if (!accessToken) {
            throw new AppError(403, "No Token Recieved")
        }

        const verifiedToken = verifyToken(accessToken,envVars.JWT_ACCESS_SECRET) as JwtPayload
        if (!verifiedToken) {
            throw new AppError(403, "You are not authorized")
        }
        if (!authRoles.includes(verifiedToken.role)) {
            throw new AppError(403, "Your are not permitted to view this route !!")
        }
        req.user = verifiedToken

        next()
    } catch (error) {
        next(error)
    }
}