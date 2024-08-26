import { Request, Response, NextFunction } from "express";
import { createGenreSchema } from "../util/validationSchema";
import * as genreService from "../service/genreService";

export const newGenre = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const { error, value } = createGenreSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: 'Validation error', details: error.details.map((detail: any) => detail.message) });
    }
        const book = await genreService.createGenre(value);
        res.status(201).json(book);
    } catch (error) {
        next(error);
    }
};

export const getAllGenre = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const genres = await genreService.getAllGenres();
        res.status(200).json(genres);
    } catch (error) {
        next(error);
    }
};