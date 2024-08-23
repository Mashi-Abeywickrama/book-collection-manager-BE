import { Request, Response, NextFunction } from 'express';
import * as bookService from '../service/bookService';

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