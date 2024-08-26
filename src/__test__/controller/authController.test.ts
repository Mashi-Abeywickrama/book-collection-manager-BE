import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import { loginUser, registerUser } from '../../controller/authController';
import { findUser, createUser } from '../../service/userService';
import { generateToken } from '../../util/authUtils';

jest.mock('bcrypt');
jest.mock('../../service/userService');
jest.mock('../../util/authUtils');

describe('Auth Controller', () => {
    let mockReq: Partial<Request>;
    let mockRes: Partial<Response>;
    let mockNext: NextFunction;
    let jsonSpy: jest.Mock;
    let statusSpy: jest.Mock;

    beforeEach(() => {
        jsonSpy = jest.fn();
        statusSpy = jest.fn(() => ({ json: jsonSpy })) as any;
        mockReq = {};
        mockRes = {
            status: statusSpy,
            json: jsonSpy,
        };
        mockNext = jest.fn();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('loginUser', () => {
        it('should return 400 if validation fails', async () => {
            mockReq.body = { email: 'invalidEmail' };

            await loginUser(mockReq as Request, mockRes as Response, mockNext);

            expect(statusSpy).toHaveBeenCalledWith(400);
            expect(jsonSpy).toHaveBeenCalledWith({
                message: 'Validation error',
                details: expect.any(Array),
            });
        });

        it('should return 401 if email is not found', async () => {
            mockReq.body = { email: 'test@example.com', password: 'password123' };
            (findUser as jest.Mock).mockResolvedValue(null);

            await loginUser(mockReq as Request, mockRes as Response, mockNext);

            expect(statusSpy).toHaveBeenCalledWith(401);
            expect(jsonSpy).toHaveBeenCalledWith({ message: 'Invalid credentials. Email not found.' });
        });

        it('should return 401 if password is incorrect', async () => {
            mockReq.body = { email: 'test@example.com', password: 'wrongpassword' };
            (findUser as jest.Mock).mockResolvedValue({ email: 'test@example.com', password: 'hashedpassword' });
            (bcrypt.compare as jest.Mock).mockResolvedValue(false);

            await loginUser(mockReq as Request, mockRes as Response, mockNext);

            expect(statusSpy).toHaveBeenCalledWith(401);
            expect(jsonSpy).toHaveBeenCalledWith({ message: 'Invalid credentials. Incorrect password.' });
        });

        it('should return a token if credentials are valid', async () => {
            const mockUser = { _id: '1', email: 'test@example.com', password: 'hashedpassword' };
            const mockToken = 'mockToken';

            mockReq.body = { email: 'test@example.com', password: 'password123' };
            (findUser as jest.Mock).mockResolvedValue(mockUser);
            (bcrypt.compare as jest.Mock).mockResolvedValue(true);
            (generateToken as jest.Mock).mockReturnValue(mockToken);

            await loginUser(mockReq as Request, mockRes as Response, mockNext);

            expect(jsonSpy).toHaveBeenCalledWith({ token: mockToken });
        });
    });

    describe('registerUser', () => {
        it('should return 400 if validation fails', async () => {
            mockReq.body = { email: 'invalidEmail' };

            await registerUser(mockReq as Request, mockRes as Response, mockNext);

            expect(statusSpy).toHaveBeenCalledWith(400);
            expect(jsonSpy).toHaveBeenCalledWith({
                message: 'Validation error',
                details: expect.any(Array),
            });
        });

        it('should return 400 if user with email already exists', async () => {
            mockReq.body = { email: 'test@example.com', password: 'password123', username: 'testuser' };
            (findUser as jest.Mock).mockResolvedValue({ email: 'test@example.com' });

            await registerUser(mockReq as Request, mockRes as Response, mockNext);

            expect(statusSpy).toHaveBeenCalledWith(400);
            expect(jsonSpy).toHaveBeenCalledWith({ message: 'User with this email already exists' });
        });

        it('should create a new user and return 201', async () => {
            const mockUser = { _id: '1', email: 'test@example.com', username: 'testuser', password: 'hashedpassword' };

            mockReq.body = { email: 'test@example.com', password: 'password123', username: 'testuser' };
            (findUser as jest.Mock).mockResolvedValue(null);
            (createUser as jest.Mock).mockResolvedValue(mockUser);

            await registerUser(mockReq as Request, mockRes as Response, mockNext);

            expect(statusSpy).toHaveBeenCalledWith(201);
            expect(jsonSpy).toHaveBeenCalledWith({ message: 'User Added successfully', user: mockUser });
        });

        it('should call next with an error if user creation fails', async () => {
            const error = new Error('User creation failed');

            mockReq.body = { email: 'test@example.com', password: 'password123', username: 'testuser' };
            (findUser as jest.Mock).mockResolvedValue(null);
            (createUser as jest.Mock).mockRejectedValue(error);

            await registerUser(mockReq as Request, mockRes as Response, mockNext);

            expect(mockNext).toHaveBeenCalledWith(error);
        });
    });
});
