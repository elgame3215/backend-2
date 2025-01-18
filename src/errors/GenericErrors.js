import { CustomError } from "./CustomError.js";

export class UnauthorizedError extends CustomError {
	constructor() {
		super('Unauthorized', 401);
	}
}

export class InternalServerError extends CustomError {
	constructor() {
		super('Error del servidor', 500);
	}
}

export class NotFoundError extends CustomError {
	constructor() {
		super('Recurso no encontrado', 404);
	}
}

export class BadRequestError extends CustomError {
	constructor(message) {
		super(message, 400);
	}
}

export class MissingCampsError extends CustomError {
	constructor(missingCamps) {
		super(`Campos faltantes: ${missingCamps.join(', ')}`, 400);
	}
}
