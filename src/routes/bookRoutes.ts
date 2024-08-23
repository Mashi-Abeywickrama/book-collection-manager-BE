import express, { NextFunction, Request, Response } from 'express';
import * as bookController from '../controller/bookController';

const router = express.Router();

router.get('/', (req: Request, res: Response, next: NextFunction) => bookController.getAllBooks(req, res, next));
router.get('/:id', (req: Request, res: Response, next: NextFunction) => bookController.getBook(req, res, next));
router.delete('/:id', (req: Request, res: Response, next: NextFunction) => bookController.deleteBook(req, res, next));

export default router;

