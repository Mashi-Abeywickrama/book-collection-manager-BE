import mongoose, { Schema, model } from 'mongoose';
import { IBook } from '../interface/dbInterfaces';

const bookSchema = new Schema<IBook>({
    title: { type: String, required: true },
    author: { type: String, required: true },
    genre: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Genre',
        required: true,
    },
    publicationDate: { type: Date, required: true },
    isbn: { type: String, unique: true },
    summary: { type: String },
    coverImg: { type: String },
});

const Book = model<IBook>('Book', bookSchema);

export default Book;
