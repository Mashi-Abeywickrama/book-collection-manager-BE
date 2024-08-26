import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { authMiddleware } from '../../middleware/authMiddleware';
import { verifyToken } from '../../util/authUtils';
import { IRequestWithUser } from '../../interface/authData';

jest.mock('../../util/authUtils');

describe('authMiddleware', () => {
    let req: Partial<Request>;
    let res: Partial<Response>;
    let next: NextFunction;

    beforeEach(() => {
        req = {
            header: jest.fn(),
        };
        res = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn(),
        };
        next = jest.fn();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should return 401 if Authorization header is missing', async () => {
        (req.header as jest.Mock).mockReturnValue('');

        await authMiddleware(req as Request, res as Response, next);

        expect(req.header).toHaveBeenCalledWith('Authorization');
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.send).toHaveBeenCalledWith({ message: 'Unauthenticated' });
    });

    it('should return 401 if Authorization header format is incorrect', async () => {
        (req.header as jest.Mock).mockReturnValue('BearerTokenWithoutSpace');

        await authMiddleware(req as Request, res as Response, next);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.send).toHaveBeenCalledWith({ message: 'Unauthenticated' });
    });

    it('should set req.user and call next if token is valid', async () => {
        const mockToken = 'mockValidToken';
        const mockUser = { userId: '123', email: 'user@example.com' };

        (req.header as jest.Mock).mockReturnValue(`Bearer ${mockToken}`);
        (verifyToken as jest.Mock).mockReturnValue(mockUser);

        await authMiddleware(req as Request, res as Response, next);

        expect(req.header).toHaveBeenCalledWith('Authorization');
        expect(verifyToken).toHaveBeenCalledWith(mockToken);
        expect((req as IRequestWithUser).user).toEqual(mockUser);
        expect(next).toHaveBeenCalled();
    });

    it('should return 401 if token has expired', async () => {
        const mockToken = 'mockExpiredToken';
        const error = new jwt.TokenExpiredError('jwt expired', new Date());

        (req.header as jest.Mock).mockReturnValue(`Bearer ${mockToken}`);
        (verifyToken as jest.Mock).mockImplementation(() => {
            throw error;
        });

        await authMiddleware(req as Request, res as Response, next);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.send).toHaveBeenCalledWith({ message: 'Token has expired' });
    });

    it('should return 401 if token is invalid', async () => {
        const mockToken = 'mockInvalidToken';
        const error = new jwt.JsonWebTokenError('invalid token');

        (req.header as jest.Mock).mockReturnValue(`Bearer ${mockToken}`);
        (verifyToken as jest.Mock).mockImplementation(() => {
            throw error;
        });

        await authMiddleware(req as Request, res as Response, next);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.send).toHaveBeenCalledWith({ message: 'Invalid token' });
    });

    it('should call next with an error if an unexpected error occurs', async () => {
        const mockToken = 'mockToken';
        const error = new Error('Unexpected error');

        (req.header as jest.Mock).mockReturnValue(`Bearer ${mockToken}`);
        (verifyToken as jest.Mock).mockImplementation(() => {
            throw error;
        });

        await authMiddleware(req as Request, res as Response, next);

        expect(next).toHaveBeenCalledWith(error);
    });
});
