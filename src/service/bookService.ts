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

export const deleteBook = async (id: string): Promise<IBook | null> => {
    return await Book.findByIdAndDelete(id).exec();
};