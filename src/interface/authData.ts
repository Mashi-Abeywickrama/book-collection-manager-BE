import { Request } from 'express';

export interface ITokenPayload {
    userId: number;
    email: string;
}
