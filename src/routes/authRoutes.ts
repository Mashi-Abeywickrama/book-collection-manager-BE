import express, { NextFunction, Request, Response } from 'express';
import * as authController from '../controller/authController';

const router = express.Router();

router.post('/login', (req: Request, res: Response, next: NextFunction) => authController.loginUser(req, res, next));

export default router;

