import { CONFIG } from '../../config/config.js';
import Joi from 'joi';
import { productResSchema } from './res.product.dto.js';

export const productListResSchema = Joi.object({
	payload: Joi.array().items(productResSchema).required(),
	totalPages: Joi.number().required(),
	page: Joi.number().required(),
	hasPrevPage: Joi.boolean().required(),
	hasNextPage: Joi.boolean().required(),
	prevPage: Joi.number().default(null).allow(null),
	nextPage: Joi.number().default(null).allow(null),
	prevLink: Joi.string()
		.uri()
		.forbidden()
		.default(obj => {
			return obj.prevPage
				? `http://localhost:${CONFIG.PORT}/api/products?page=${obj.prevPage}`
				: null;
		}),
	nextLink: Joi.string()
		.uri()
		.forbidden()
		.default(obj => {
			return obj.prevPage
				? `http://localhost:${CONFIG.PORT}/api/products?page=${obj.nextPage}`
				: null;
		}),
}).rename('docs', 'payload');
