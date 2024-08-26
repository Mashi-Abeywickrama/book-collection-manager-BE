import express, { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { verifyToken } from "../util/authUtils";
import { IRequestWithUser } from "../interface/authData";

const app = express();
app.use(express.json());

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    let tokenHeaderKey = "Authorization";

    try {
        const bearer = req.header(tokenHeaderKey);
        if (!bearer || bearer === "") {
            return res.status(401).send({ message: "Unauthenticated" });
        }

        const bearerParts = bearer.split(" ");
        if (bearerParts.length !== 2) {
            return res.status(401).send({ message: "Unauthenticated" });
        }

        const token = bearerParts[1];
        try {
            const verified = verifyToken(token);
            (req as IRequestWithUser).user = {
                userId: verified.userId,
                email: verified.email
            };
            next();
            
        } catch (error) {
            if (error instanceof jwt.TokenExpiredError) {
                return res.status(401).send({ message: "Token has expired" });
            } else if (error instanceof jwt.JsonWebTokenError) {
                return res.status(401).send({ message: "Invalid token" });
            } else {
                throw error;
            }
        }
    } catch (error) {
        next(error);
    }
};
