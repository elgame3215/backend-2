import { CustomError } from './CustomError.js';

export class UnauthorizedError extends CustomError {
	constructor() {
		super('Unauthorized', 401);
	}
}

export class ForbiddenError extends CustomError {
	constructor() {
		super('Forbidden', 403);
	}
}

export class InternalServerError extends CustomError {
	constructor() {
		super('Internal server error', 500);
	}
}

export class NotFoundError extends CustomError {
	constructor() {
		super('Not found', 404);
	}
}

export class DtoError extends CustomError {
	constructor(dtoError) {
		super(dtoError.details[0].message, 400);
	}
}
