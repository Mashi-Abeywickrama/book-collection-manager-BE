import { IBook } from '../interface/dbInterfaces';
import Book from '../models/book.model';
import Genre from '../models/genre.model';

export const getAllBooks = async (): Promise<IBook[]> => {
    return await Book.find()
        .populate({ path: 'genre', select: 'name' , model: Genre})
        .exec();
};

export const findBook = async (id: string): Promise<IBook | null> => {
    return await Book.findById(id)
        .populate({ path: 'genre', select: 'name' , model: Genre})
        .exec();
};

export const createBook = async (book: IBook): Promise<IBook> => {
    return await Book.create(book);
};

export const updateBook = async (id: string, book: Partial<IBook>): Promise<IBook | null> => {
    return await Book.findByIdAndUpdate(id, book, { new: true }).exec();
};

export const deleteBook = async (id: string): Promise<IBook | null> => {
    return await Book.findByIdAndDelete(id).exec();
};