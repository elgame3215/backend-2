import { CustomError } from './CustomError.js';

export class InvalidMongoIDError extends CustomError {
	constructor() {
		super('ID inválido', 400);
	}
}
