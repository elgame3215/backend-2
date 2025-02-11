import { idSchema } from '../IDs/index.js';
import Joi from 'joi';
import { productResSchema } from '../product/res.product.dto.js';

export const cartResSchema = Joi.object({
	id: idSchema.required(),
	products: Joi.array().items(
		Joi.object({
			product: productResSchema,
			quantity: Joi.number().required(),
		})
	),
});
