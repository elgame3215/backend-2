import Joi from 'joi';

export const mongoIdSchema = Joi.string().hex().length(24).required();
