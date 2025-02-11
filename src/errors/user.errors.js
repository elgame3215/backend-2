import { CustomError } from './CustomError.js';

export class existingEmailError extends CustomError {
	constructor() {
		super('Email ya registrado', 400);
	}
}

export class InvalidCredentialsError extends CustomError {
	constructor() {
		super('Credenciales inválidas', 401);
	}
}
