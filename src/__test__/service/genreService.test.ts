import Genre from '../../models/genre.model';
import * as genreService from '../../service/genreService';

jest.mock('../../models/genre.model');

describe('Genre Service', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('createGenre', () => {
        it('should create a new genre', async () => {
            const mockGenre = { _id: '1', name: 'Fiction' };

            const createSpy = jest.spyOn(Genre, 'create').mockResolvedValue(mockGenre as any);

            const result = await genreService.createGenre(mockGenre as any);

            expect(createSpy).toHaveBeenCalledWith(mockGenre);
            expect(result).toEqual(mockGenre);
        });

        it('should throw an error if genre creation fails', async () => {
            const mockGenre = { _id: '1', name: 'Fiction' };
            const error = new Error('Genre creation failed');

            const createSpy = jest.spyOn(Genre, 'create').mockRejectedValue(error);

            await expect(genreService.createGenre(mockGenre as any)).rejects.toThrow('Genre creation failed');
            expect(createSpy).toHaveBeenCalledWith(mockGenre);
        });
    });

    describe('getAllGenres', () => {
        it('should return all genres', async () => {
            const mockGenres = [
                { _id: '1', name: 'Fiction' },
                { _id: '2', name: 'Non-Fiction' },
            ];

            const findSpy = jest.spyOn(Genre, 'find').mockReturnValue({
                exec: jest.fn().mockResolvedValue(mockGenres),
            } as any);

            const result = await genreService.getAllGenres();

            expect(findSpy).toHaveBeenCalledTimes(1);
            expect(result).toEqual(mockGenres);
        });

        it('should return an empty array if no genres are found', async () => {
            const findSpy = jest.spyOn(Genre, 'find').mockReturnValue({
                exec: jest.fn().mockResolvedValue([]),
            } as any);

            const result = await genreService.getAllGenres();

            expect(findSpy).toHaveBeenCalledTimes(1);
            expect(result).toEqual([]);
        });
    });
});
