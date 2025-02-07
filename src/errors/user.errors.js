import { CustomError } from './CustomError.js';

export class WeakPasswordError extends CustomError {
	constructor() {
		super('Contraseña muy debil', 400);
	}
}

export class InvalidEmailError extends CustomError {
	constructor() {
		super('Email inválido', 400);
	}
}

export class existingEmailError extends CustomError {
	constructor() {
		super('Email ya registrado', 400);
	}
}

export class InvalidDateBirthError extends CustomError {
	constructor(isUnderage = false) {
		const message = isUnderage
			? 'Debes ser mayor de edad'
			: 'Fecha de nacimiento inválida';
		super(message, 400);
	}
}

export class InvalidCredentialsError extends CustomError {
	constructor() {
		super('Credenciales inválidas', 401);
	}
}
