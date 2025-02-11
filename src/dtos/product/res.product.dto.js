import { idSchema } from '../IDs/index.js';
import Joi from 'joi';
import { productReqSchema } from '../product/req.product.dto.js';

export const productResSchema = Joi.object({
	id: idSchema.required(),
}).concat(productReqSchema);
