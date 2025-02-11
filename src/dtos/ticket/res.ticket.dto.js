import Joi from 'joi';

export const ticketResSchema = Joi.object({
	code: Joi.string().uuid().required(),
	amount: Joi.number().min(0).required(),
	purchaser: Joi.string().email().required(),
	purchaseDatetime: Joi.date().required(),
}).rename('purchase_datetime', 'purchaseDatetime');
