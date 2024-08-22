import mongoose from 'mongoose';

export interface IUser {
    username: string;
    email: string;
    password: string;
}

export interface IGenre {
    name: string;
}

export interface IAuthor {
    name: string;
    bio?: string;
    birthDate?: Date;
    deathDate?: Date;
}

export interface IBook {
    title: string;
    isbn: string;
    author: mongoose.Schema.Types.ObjectId;
    genre: mongoose.Schema.Types.ObjectId;
    publicationDate: Date;
    summary?: string;
    coverImg?: string;
}
