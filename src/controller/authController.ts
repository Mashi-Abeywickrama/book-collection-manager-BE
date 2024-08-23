import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import { generateToken } from '../util/authUtils';
import { createUser, findUser } from '../service/userService';
import { loginSchema, registerSchema } from '../util/validationSchema';

export const loginUser = async (req: Request, res: Response, next: NextFunction) => {
    const { error, value } = loginSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: 'Validation error', details: error.details.map((detail: any) => detail.message) });
    }
    const { email, password } = value;

    try {
        // Check if user exists
        const user = await findUser(email);
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials. Email not found.' });
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid credentials. Incorrect password.' });
        }

        // Generate JWT token
        const token = generateToken({ userId: user._id.toString(), email: user.email });
        res.json({ token });

    } catch (error) {
        next(error);
    }
};

export const registerUser = async (req: Request, res: Response, next: NextFunction) => {
    const { error, value } = registerSchema.validate(req.body, { abortEarly: false });

    if (error) {
        return res.status(400).json({ message: 'Validation error', details: error.details.map((detail: any) => detail.message) });
    }
    const { email, password, username } = value;

    try {
        //if user email exists
        const user = await findUser(email);
        if (user) {
            return res.status(400).json({ message: 'User with this email already exists' });
        }

        const newUser = await createUser(value);
        res.status(201).json({ message: 'User Added successfully', user: newUser });
    } catch (error) {
        next(error);
    }
}