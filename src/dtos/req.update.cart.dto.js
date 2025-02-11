import { idSchema } from './IDs/index.js';
import Joi from 'joi';

export const updateCartReqSchema = Joi.array().items(
	Joi.object({
		product: idSchema.required(),
		quantity: Joi.number().min(0).required(),
	})
);
