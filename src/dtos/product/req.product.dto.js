import Joi from 'joi';

export const productReqSchema = Joi.object({
	title: Joi.string().trim().required(),
	description: Joi.string().trim().required(),
	code: Joi.string().trim().alphanum().required(),
	price: Joi.number().min(0).required(),
	stock: Joi.number().min(0).required(),
	category: Joi.string().trim().required(),
});
