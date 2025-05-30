import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
// import { Payload } from "../helpers/types/express/jwt"; // adjust path if needed
import { Payload } from "../helpers/types/express/jwt";

dotenv.config();

const { JWT_SECRET } = process.env;

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers["authorization"];

    if (typeof authHeader !== "undefined") {
        const token = authHeader.split(" ")[1];

        jwt.verify(token, JWT_SECRET!, (error, decoded) => {
            if (error) {
                return res.status(401).json({
                    status: "error",
                    message: "Session expired. Sign in again.",
                });
            }

            req.user = decoded as Payload;
            next();
        });
    } else {
        return res.status(403).json({
            status: "error",
            message: "Unauthorized. Login or signup to view this resource.",
        });
    }
};