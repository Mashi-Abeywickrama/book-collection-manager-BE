import { Request, Response, NextFunction } from "express";
import bcrypt from 'bcrypt';
import { generateToken } from "../util/authUtils";
import { findUser } from "../service/userService";
import { loginSchema } from "../util/validationSchema";

export const loginUser = async (req: Request, res: Response, next: NextFunction) => {
    const { error, value } = loginSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: 'Validation error', details: error.details.map((detail: any) => detail.message) });
    }
    const { email, password } = req.body;

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