import { InvalidMongoIDError } from '../../errors/mongo.errors.js';
import { isValidObjectId } from 'mongoose';
import Joi from 'joi';

export const mongoIdSchema = Joi.any().custom(validateMongoId);

export const mongoIdParamSchema = Joi.object({
	pid: mongoIdSchema,
	cid: mongoIdSchema,
});

function validateMongoId(val) {
	if (!isValidObjectId(val)) {
		throw new InvalidMongoIDError();
	}
	return val;
}
