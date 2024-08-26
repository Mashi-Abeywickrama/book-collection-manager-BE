import mongoose from 'mongoose';
import Book from '../../models/book.model';
import Genre from '../../models/genre.model';
import { getAllBooks, findBook, createBook, updateBook, deleteBook } from '../../service/bookService';
import { IBook } from '../../interface/dbInterfaces';

jest.mock('../../models/book.model');
jest.mock('../../models/genre.model');

describe('Book Service', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('getAllBooks', () => {
        it('should fetch all books', async () => {
            const mockBooks = [{ title: 'Book 1' }, { title: 'Book 2' }] as IBook[];
            const populateSpy = jest.fn().mockReturnThis();
            const execSpy = jest.fn().mockResolvedValue(mockBooks);

            (Book.find as jest.Mock).mockReturnValue({ populate: populateSpy, exec: execSpy });

            const books = await getAllBooks();

            expect(Book.find).toHaveBeenCalled();
            expect(populateSpy).toHaveBeenCalledWith({ path: 'genre', select: 'name', model: Genre });
            expect(execSpy).toHaveBeenCalled();
            expect(books).toEqual(mockBooks);
        });
    });

    describe('findBook', () => {
        it('should find a book by ID', async () => {
            const mockBook = { title: 'Book 1' } as IBook;
            const populateSpy = jest.fn().mockReturnThis();
            const execSpy = jest.fn().mockResolvedValue(mockBook);

            (Book.findById as jest.Mock).mockReturnValue({ populate: populateSpy, exec: execSpy });

            const book = await findBook('123');

            expect(Book.findById).toHaveBeenCalledWith('123');
            expect(populateSpy).toHaveBeenCalledWith({ path: 'genre', select: 'name', model: Genre });
            expect(execSpy).toHaveBeenCalled();
            expect(book).toEqual(mockBook);
        });
    });

    describe('createBook', () => {
        it('should create a new book', async () => {
            const mockBook = { title: 'New Book' } as IBook;

            (Book.create as jest.Mock).mockResolvedValue(mockBook);

            const book = await createBook(mockBook);

            expect(Book.create).toHaveBeenCalledWith(mockBook);
            expect(book).toEqual(mockBook);
        });
    });

    describe('updateBook', () => {
        it('should update a book by ID', async () => {
            const mockBook = { title: 'Updated Book' } as IBook;
            const execSpy = jest.fn().mockResolvedValue(mockBook);

            (Book.findByIdAndUpdate as jest.Mock).mockReturnValue({ exec: execSpy });

            const book = await updateBook('123', { title: 'Updated Book' });

            expect(Book.findByIdAndUpdate).toHaveBeenCalledWith('123', { title: 'Updated Book' }, { new: true });
            expect(execSpy).toHaveBeenCalled();
            expect(book).toEqual(mockBook);
        });
    });

    describe('deleteBook', () => {
        it('should delete a book by ID', async () => {
            const mockBook = { title: 'Deleted Book' } as IBook;
            const execSpy = jest.fn().mockResolvedValue(mockBook);

            (Book.findByIdAndDelete as jest.Mock).mockReturnValue({ exec: execSpy });

            const book = await deleteBook('123');

            expect(Book.findByIdAndDelete).toHaveBeenCalledWith('123');
            expect(execSpy).toHaveBeenCalled();
            expect(book).toEqual(mockBook);
        });
    });
});
