import { Request, Response, NextFunction } from 'express';
import { handleMongooseError } from './mongooseErrorHandler';

const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {

    const errorResponse = handleMongooseError(err);
    res.status(errorResponse.status).json({
        message: errorResponse.message,
        details: errorResponse.details,
    });

};

export default errorHandler;
