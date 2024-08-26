import { Request, Response, NextFunction } from 'express';
import { ValidationError } from 'joi';
import * as bookController from '../../controller/bookController'
import * as bookService from '../../service/bookService';
import { createBookSchema } from '../../util/validationSchema';

jest.mock('../../service/bookService');

describe('Book Controller', () => {
    let req: Partial<Request>;
    let res: Partial<Response>;
    let next: NextFunction;

    beforeEach(() => {
        req = {};
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        next = jest.fn();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('getAllBooks', () => {
        it('should return all books with status 200', async () => {
            const books = [{ id: 1, title: 'Test Book' }];
            (bookService.getAllBooks as jest.Mock).mockResolvedValue(books);

            await bookController.getAllBooks(req as Request, res as Response, next);

            expect(bookService.getAllBooks).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(books);
        });

        it('should call next with an error if service fails', async () => {
            const error = new Error('Service failed');
            (bookService.getAllBooks as jest.Mock).mockRejectedValue(error);

            await bookController.getAllBooks(req as Request, res as Response, next);

            expect(next).toHaveBeenCalledWith(error);
        });
    });

    describe('getBook', () => {
        it('should return the book with status 200 if found', async () => {
            const book = { id: 1, title: 'Test Book' };
            req.params = { id: '1' };
            (bookService.findBook as jest.Mock).mockResolvedValue(book);

            await bookController.getBook(req as Request, res as Response, next);

            expect(bookService.findBook).toHaveBeenCalledWith('1');
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(book);
        });

        it('should return 404 if book is not found', async () => {
            req.params = { id: '1' };
            (bookService.findBook as jest.Mock).mockResolvedValue(null);

            await bookController.getBook(req as Request, res as Response, next);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ message: 'Book not found' });
        });

        it('should call next with an error if service fails', async () => {
            const error = new Error('Service failed');
            req.params = { id: '1' };
            (bookService.findBook as jest.Mock).mockRejectedValue(error);

            await bookController.getBook(req as Request, res as Response, next);

            expect(next).toHaveBeenCalledWith(error);
        });
    });

    describe('deleteBook', () => {
        it('should delete the book and return status 200 if successful', async () => {
            const deletedBook = { id: 1, title: 'Deleted Book' };
            req.params = { id: '1' };
            (bookService.deleteBook as jest.Mock).mockResolvedValue(deletedBook);

            await bookController.deleteBook(req as Request, res as Response, next);

            expect(bookService.deleteBook).toHaveBeenCalledWith('1');
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ message: 'Book deleted successfully' });
        });

        it('should return 404 if the book is not found', async () => {
            req.params = { id: '1' };
            (bookService.deleteBook as jest.Mock).mockResolvedValue(null);

            await bookController.deleteBook(req as Request, res as Response, next);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ message: 'Book not found' });
        });

        it('should call next with an error if service fails', async () => {
            const error = new Error('Service failed');
            req.params = { id: '1' };
            (bookService.deleteBook as jest.Mock).mockRejectedValue(error);

            await bookController.deleteBook(req as Request, res as Response, next);

            expect(next).toHaveBeenCalledWith(error);
        });
    });

    describe('updateBook', () => {
        it('should update the book and return status 200 if successful', async () => {
            const updatedBook = { id: 1, title: 'Updated Book' };
            req.params = { id: '1' };
            req.body = { title: 'Updated Book' };
            (bookService.updateBook as jest.Mock).mockResolvedValue(updatedBook);

            await bookController.updateBook(req as Request, res as Response, next);

            expect(bookService.updateBook).toHaveBeenCalledWith('1', req.body);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(updatedBook);
        });

        it('should return 404 if the book is not found', async () => {
            req.params = { id: '1' };
            req.body = { title: 'Updated Book' };
            (bookService.updateBook as jest.Mock).mockResolvedValue(null);

            await bookController.updateBook(req as Request, res as Response, next);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ message: 'Book not found' });
        });
        
    });
    
    describe('createBook', () => {
        it('should create a book and return status 201 if successful', async () => {
            const newBook = { id: 1, title: 'New Book' };
            req.body = { title: 'New Book' };

            jest.spyOn(createBookSchema, 'validate').mockReturnValue({ error: undefined, value: req.body });
            (bookService.createBook as jest.Mock).mockResolvedValue(newBook);

            await bookController.createBook(req as Request, res as Response, next);

            expect(bookService.createBook).toHaveBeenCalledWith(req.body);
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith(newBook);
        });

        it('should return 400 if validation fails', async () => {
            const validationError: ValidationError = {
                name: 'ValidationError',
                isJoi: true,
                annotate: () => '',
                _original: req.body,
                message: 'Validation error',
                details: [{
                    message: 'Validation error',
                    path: [],
                    type: ''
                }],
            };
            req.body = { title: '' }; // Invalid data

            jest.spyOn(createBookSchema, 'validate').mockReturnValue({
                error: validationError,
                value: undefined
            });

            await bookController.createBook(req as Request, res as Response, next);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Validation error',
                details: ['Validation error'],
            });
        });
    });    
});