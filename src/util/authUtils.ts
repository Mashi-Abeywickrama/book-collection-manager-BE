import jwt from 'jsonwebtoken';
import { ITokenPayload } from '../interface/authData';

const secretKey = process.env.JWT_SECRET || 'your_secret_key';
const expirationTime = process.env.JWT_EXPIRATION_TIME || '1d';

const generateToken = (payload: ITokenPayload): string => {
    return jwt.sign(payload, secretKey, { expiresIn: expirationTime });
};

const verifyToken = (token: string): ITokenPayload => {
    return jwt.verify(token, secretKey) as ITokenPayload;
};

export { generateToken, verifyToken };
