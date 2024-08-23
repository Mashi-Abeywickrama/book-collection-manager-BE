import { Error } from 'mongoose';

export const handleMongooseError = (error: any) => {
    if (error instanceof Error.ValidationError) {
        return {
            status: 400,
            message: 'Validation Error',
            details: error.errors,
        };
    }

    //invalid data types
    if (error instanceof Error.CastError) {
        return {
            status: 400,
            message: 'Invalid ID format',
            details: error.message,
        };
    }
    // Duplicate key error
    if (error.code === 11000) { 
        return {
            status: 409,
            message: 'Duplicate key error',
            details: error.message,
        };
    }

    // Fallback for non-Mongoose errors
    return {
        status: 500,
        message: 'An unexpected error occurred',
        details: error.message,
    };
};
