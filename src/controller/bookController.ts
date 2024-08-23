import { Request, Response, NextFunction } from 'express';
import * as bookService from '../service/bookService';
import { createBookSchema, updateBookSchema } from '../util/validationSchema';

export const getAllBooks = async (req: Request, res: Response, next: NextFunction) => {
    try{
        const books = await bookService.getAllBooks();
        res.status(200).json(books);
    } catch (error) {
        next(error);
    }
};

export const getBook = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const book = await bookService.findBook(req.params.id);
        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }
        res.status(200).json(book);
    } catch (error) {
        next(error);
    }
};

export const deleteBook = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const deletedBook = await bookService.deleteBook(req.params.id);
        
        // Check deletion
        if (!deletedBook) {
            return res.status(404).json({ message: 'Book not found' });
        }

        res.status(200).json({ message: 'Book deleted successfully' });
    } catch (error) {
        console.error('Error deleting book:', error);
        next(error);
    }
};

export const updateBook = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { error, value } = updateBookSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ message: 'Validation error', details: error.details.map((detail: any) => detail.message) });
        }
        const updatedBook = await bookService.updateBook(req.params.id, value);
        if (!updatedBook) {
            return res.status(404).json({ message: 'Book not found' });
        }
        res.status(200).json(updatedBook);
    } catch (error) {
        next(error);
    }
};

export const createBook = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const { error, value } = createBookSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: 'Validation error', details: error.details.map((detail: any) => detail.message) });
    }
        const book = await bookService.createBook(value);
        res.status(201).json(book);
    } catch (error) {
        next(error);
    }
};