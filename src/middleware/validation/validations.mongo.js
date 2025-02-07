import { InvalidMongoIDError } from '../../errors/mongo.errors.js';
import { isValidObjectId } from 'mongoose';

export function validatePid(req, res, next) {
	const { pid } = req.params;
	if (!isValidObjectId(pid)) {
		next(new InvalidMongoIDError());
	}
	next();
}
export function validateCid(req, res, next) {
	const { cid } = req.params;
	if (!isValidObjectId(cid)) {
		next(new InvalidMongoIDError());
	}
	next();
}
