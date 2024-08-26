import jwt from 'jsonwebtoken';
import { generateToken, verifyToken } from '../../util/authUtils';
import { ITokenPayload } from '../../interface/authData';

jest.mock('jsonwebtoken');

describe('authUtils', () => {
    const secretKey = 'your_secret_key';
    const expirationTime = '1d';

    const mockPayload: ITokenPayload = {
        userId: 123,
        email: 'user@example.com',
    };

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('generateToken', () => {
        it('should generate a JWT token with the given payload', () => {
            const mockToken = 'mockJwtToken';

            (jwt.sign as jest.Mock).mockReturnValue(mockToken);

            // Directly invoke the function
            const token = generateToken(mockPayload);

            expect(jwt.sign).toHaveBeenCalledWith(mockPayload, secretKey, { expiresIn: expirationTime });
            expect(token).toBe(mockToken);
        });
    });

    describe('verifyToken', () => {
        it('should verify the JWT token and return the payload', () => {
            (jwt.verify as jest.Mock).mockReturnValue(mockPayload);

            const token = 'mockJwtToken';

            // Directly invoke the function
            const payload = verifyToken(token);

            expect(jwt.verify).toHaveBeenCalledWith(token, secretKey);
            expect(payload).toEqual(mockPayload);
        });

        it('should throw an error if the JWT token is invalid', () => {
            const token = 'invalidJwtToken';

            (jwt.verify as jest.Mock).mockImplementation(() => {
                throw new jwt.JsonWebTokenError('invalid token');
            });

            // Directly invoke the function
            expect(() => verifyToken(token)).toThrow(jwt.JsonWebTokenError);
            expect(jwt.verify).toHaveBeenCalledWith(token, secretKey);
        });

        it('should throw an error if the JWT token has expired', () => {
            const token = 'expiredJwtToken';

            (jwt.verify as jest.Mock).mockImplementation(() => {
                throw new jwt.TokenExpiredError('jwt expired', new Date());
            });

            // Directly invoke the function
            expect(() => verifyToken(token)).toThrow(jwt.TokenExpiredError);
            expect(jwt.verify).toHaveBeenCalledWith(token, secretKey);
        });
    });
});
