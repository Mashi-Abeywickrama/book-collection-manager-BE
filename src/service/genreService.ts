import { IGenre } from "../interface/dbInterfaces";
import Genre from "../models/genre.model";

export const createGenre = async (genre: IGenre): Promise<IGenre> => {
    return await Genre.create(genre);
};

export const getAllGenres = async (): Promise<IGenre[]> => {
    return await Genre.find().exec();
};