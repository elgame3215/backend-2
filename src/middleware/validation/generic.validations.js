import { InvalidMongoIDError } from '../../errors/MongoErrors.js';
import { isValidObjectId } from 'mongoose';
import { MissingCampsError } from '../../errors/GenericErrors.js';

export function validateCamps(requiredCamps) {
	return async function (req, res, next) {
		const recievedCamps = Object.keys(req.body);
		const missingCamps = requiredCamps.filter(
			required => !recievedCamps.includes(required)
		);
		if (missingCamps.length) {
			return next(new MissingCampsError(missingCamps));
		}
		return next();
	};
}
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
