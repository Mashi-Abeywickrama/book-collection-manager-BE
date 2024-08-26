import User from '../../models/user.model';
import * as userService from '../../service/userService';

jest.mock('../../models/user.model');

describe('User Service', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('findUser', () => {
        it('should return a user by email', async () => {
            const mockUser = { _id: '1', username: 'testuser', email: 'test@example.com', password: 'hashedpassword' };

            const findOneSpy = jest.spyOn(User, 'findOne').mockReturnValue({
                exec: jest.fn().mockResolvedValue(mockUser),
            } as any);

            const result = await userService.findUser('test@example.com');

            expect(findOneSpy).toHaveBeenCalledWith({ email: 'test@example.com' });
            expect(result).toEqual(mockUser);
        });

        it('should return null if no user is found', async () => {
            const findOneSpy = jest.spyOn(User, 'findOne').mockReturnValue({
                exec: jest.fn().mockResolvedValue(null),
            } as any);

            const result = await userService.findUser('nonexistent@example.com');

            expect(findOneSpy).toHaveBeenCalledWith({ email: 'nonexistent@example.com' });
            expect(result).toBeNull();
        });
    });

    describe('createUser', () => {
        it('should create a new user', async () => {
            const mockUser = { _id: '1', username: 'testuser', email: 'test@example.com', password: 'hashedpassword' };

            const createSpy = jest.spyOn(User, 'create').mockResolvedValue(mockUser as any);

            const result = await userService.createUser(mockUser as any);

            expect(createSpy).toHaveBeenCalledWith(mockUser);
            expect(result).toEqual(mockUser);
        });

        it('should throw an error if user creation fails', async () => {
            const mockUser = { _id: '1', username: 'testuser', email: 'test@example.com', password: 'hashedpassword' };
            const error = new Error('User creation failed');

            const createSpy = jest.spyOn(User, 'create').mockRejectedValue(error);

            await expect(userService.createUser(mockUser as any)).rejects.toThrow('User creation failed');
            expect(createSpy).toHaveBeenCalledWith(mockUser);
        });
    });
});
