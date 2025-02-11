import { idSchema } from '../IDs/index.js';
import Joi from 'joi';

export const userResSchema = Joi.object({
	firstName: Joi.string().trim().required(),
	lastName: Joi.string().trim().required(),
	age: Joi.number().integer().required(),
	email: Joi.string().trim().email().required(),
	role: Joi.string().allow('user', 'admin').required(),
	cart: idSchema,
})
	.rename('first_name', 'firstName')
	.rename('last_name', 'lastName');
