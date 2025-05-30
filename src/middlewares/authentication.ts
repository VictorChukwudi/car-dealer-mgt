import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken"
import dotenv from "dotenv"

dotenv.config()

const { JWT_SECRET } = process.env
export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers["authorization"];
    if (typeof authHeader !== "undefined") {
        const token = authHeader.split(" ")[1];

        jwt.verify(token, JWT_SECRET!, (error, user) => {
            if (error) {
                res.status(400).json({
                    status: "Error",
                    message: "Session Expired. Signin again.",
                });
            } else {
                req.user = user as JwtPayload
                next();
            }
        });
    } else {
        res.status(403).json({
            status: "Error",
            msg: "Unauthorized. Login or signup to view this resource",
        });
    }
}