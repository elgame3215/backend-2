import { CustomError } from './CustomError.js';

export class InvalidMongoIDError extends CustomError {
	constructor() {
		super('ID inválido, debe ser una cadena de 24 caracteres hexadecimales', 400);
	}
}
