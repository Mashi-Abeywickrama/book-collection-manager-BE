import mongoose from 'mongoose';

export interface IUser {
    _id: any;
    username: string;
    email: string;
    password: string;
}

export interface IGenre {
    name: string;
}

export interface IBook {
    title: string;
    isbn: string;
    author: string;
    genre: mongoose.Schema.Types.ObjectId | IGenre;
    publicationDate: Date;
    summary?: string;
    coverImg?: string;
}
