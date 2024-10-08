import { IUser } from '../interface/dbInterfaces';
import User from '../models/user.model';

export const findUser = async (email: string): Promise<IUser | null> => {
    return await User.findOne({ email }).exec();
};

export const createUser = async (user: IUser): Promise<IUser> => {
    return await User.create(user);
};
