import { CustomError } from "./CustomError.js";

export class WeakPasswordError extends CustomError {
	constructor () {
		super('Contraseña muy debil', 400);
	}
}

export class InvalidEmailError extends CustomError {
	constructor () {
		super('Email inválido', 400);
	}
}

export class InvalidDateBirthError extends CustomError {
	constructor () {
		super('Fecha de nacimiento inválida', 400);
	}
}

export class InvalidCredentialsError extends CustomError {
	constructor () {
		super('Credenciales inválidas', 401);
	}
}