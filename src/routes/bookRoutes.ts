import express, { NextFunction, Request, Response } from 'express';
import * as bookController from '../controller/bookController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = express.Router();

router.use(authMiddleware);

router.post('/', (req: Request, res: Response, next: NextFunction) => bookController.createBook(req, res, next));
router.get('/', (req: Request, res: Response, next: NextFunction) => bookController.getAllBooks(req, res, next));
router.get('/:id', (req: Request, res: Response, next: NextFunction) => bookController.getBook(req, res, next));
router.delete('/:id', (req: Request, res: Response, next: NextFunction) => bookController.deleteBook(req, res, next));
router.patch('/:id', (req: Request, res: Response, next: NextFunction) => bookController.updateBook(req, res, next));

export default router;

