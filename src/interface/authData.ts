import {Request} from 'express';

export interface ITokenPayload {
    userId: number;
    email: string;
}

export interface IRequestWithUser extends Request {
    user: {
        userId: number;
        email: string;
    };
}
