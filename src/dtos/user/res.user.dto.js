import Joi from 'joi';

export const userResSchema = Joi.object({
	first_name: Joi.string().trim().required(),
	last_name: Joi.string().trim().required(),
	age: Joi.number().integer().required(),
	email: Joi.string().trim().email().required(),
	rol: Joi.string().allow('user', 'admin').required(),
});
