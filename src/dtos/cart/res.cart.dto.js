import Joi from 'joi';
import { mongoIdSchema } from '../mongoId.dto.js';
import { productResSchema } from '../product/res.product.dto.js';

export const cartResSchema = Joi.object({
	_id: mongoIdSchema,
	products: Joi.array().items(productResSchema),
});
