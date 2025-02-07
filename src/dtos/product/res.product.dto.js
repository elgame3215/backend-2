import Joi from 'joi';
import { mongoIdSchema } from '../mongoId.dto.js';
import { productReqSchema } from '../product/req.product.dto.js';

export const productResSchema = Joi.object({
	_id: mongoIdSchema,
}).keys(productReqSchema.describe());
