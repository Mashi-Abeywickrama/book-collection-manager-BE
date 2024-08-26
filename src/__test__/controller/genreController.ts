import { Request, Response, NextFunction } from 'express';
import { newGenre, getAllGenre } from '../../controller/genreController';
import * as genreService from '../../service/genreService';
import { createGenreSchema } from '../../util/validationSchema';

jest.mock('../../service/genreService');
jest.mock('../../util/validationSchema');

describe('Genre Controller', () => {
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

    describe('newGenre', () => {
        it('should create a new genre and return status 201 with the genre', async () => {
            const mockGenre = { _id: '1', name: 'Fiction' };
            req.body = { name: 'Fiction' };

            (createGenreSchema.validate as jest.Mock).mockReturnValue({ error: null, value: req.body });
            (genreService.createGenre as jest.Mock).mockResolvedValue(mockGenre);

            await newGenre(req as Request, res as Response, next);

            expect(createGenreSchema.validate).toHaveBeenCalledWith(req.body);
            expect(genreService.createGenre).toHaveBeenCalledWith(req.body);
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith(mockGenre);
        });

        it('should return status 400 if validation fails', async () => {
            const validationError = { details: [{ message: 'Name is required' }] };
            req.body = { name: '' };

            (createGenreSchema.validate as jest.Mock).mockReturnValue({ error: validationError, value: null });

            await newGenre(req as Request, res as Response, next);

            expect(createGenreSchema.validate).toHaveBeenCalledWith(req.body);
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ message: 'Validation error', details: ['Name is required'] });
        });

        it('should call next with an error if createGenre throws', async () => {
            const error = new Error('Something went wrong');
            req.body = { name: 'Fiction' };

            (createGenreSchema.validate as jest.Mock).mockReturnValue({ error: null, value: req.body });
            (genreService.createGenre as jest.Mock).mockRejectedValue(error);

            await newGenre(req as Request, res as Response, next);

            expect(createGenreSchema.validate).toHaveBeenCalledWith(req.body);
            expect(genreService.createGenre).toHaveBeenCalledWith(req.body);
            expect(next).toHaveBeenCalledWith(error);
        });
    });

    describe('getAllGenre', () => {
        it('should return status 200 with all genres', async () => {
            const mockGenres = [
                { _id: '1', name: 'Fiction' },
                { _id: '2', name: 'Non-Fiction' },
            ];

            (genreService.getAllGenres as jest.Mock).mockResolvedValue(mockGenres);

            await getAllGenre(req as Request, res as Response, next);

            expect(genreService.getAllGenres).toHaveBeenCalledTimes(1);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(mockGenres);
        });

        it('should call next with an error if getAllGenres throws', async () => {
            const error = new Error('Something went wrong');

            (genreService.getAllGenres as jest.Mock).mockRejectedValue(error);

            await getAllGenre(req as Request, res as Response, next);

            expect(genreService.getAllGenres).toHaveBeenCalledTimes(1);
            expect(next).toHaveBeenCalledWith(error);
        });
    });
});
