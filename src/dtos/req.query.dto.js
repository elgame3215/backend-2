import Joi from 'joi';

export const queryReqSchema = Joi.object({
	limit: Joi.number(),
	page: Joi.number(),
	sort: Joi.string().allow('asc', 'desc'),
	query: Joi.string().lowercase(),
});
