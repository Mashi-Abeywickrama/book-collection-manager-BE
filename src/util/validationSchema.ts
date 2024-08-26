import Joi from 'joi';

export const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
});

export const registerSchema = Joi.object({
    username: Joi.string().min(3).required(),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
});

export const createBookSchema = Joi.object({
    title: Joi.string().required(),
    author: Joi.string().required(),
    genre: Joi.string().required(),
    publicationDate: Joi.date().required(),
    isbn: Joi.string().required(),
    summary: Joi.string().allow(null).optional().empty(''),
    coverImg: Joi.string().allow(null).optional().empty(''),
});

export const updateBookSchema = Joi.object({
    title: Joi.string().optional(),
    author: Joi.string().optional(),
    genre: Joi.string().optional(),
    publicationDate: Joi.date(),
    isbn: Joi.string().optional(),
    summary: Joi.string().allow(null).optional().empty(''),
    coverImg: Joi.string().allow(null).optional().empty(''),
}).min(1);

export const createGenreSchema = Joi.object({
    name: Joi.string().required(),
});