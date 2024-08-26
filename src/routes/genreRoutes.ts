import express, { NextFunction, Request, Response } from 'express';
import * as genreController from '../controller/genreController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = express.Router();

router.use(authMiddleware);

router.post('/', (req: Request, res: Response, next: NextFunction) => genreController.newGenre(req, res, next));
router.get('/', (req: Request, res: Response, next: NextFunction) => genreController.getAllGenre(req, res, next));

export default router;

