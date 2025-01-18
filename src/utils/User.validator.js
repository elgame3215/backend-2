import { CONFIG } from '../config/config.js';
import {
	InvalidDateBirthError,
	InvalidEmailError,
	WeakPasswordError,
} from '../errors/user.errors.js';

const {AGE_REQUIRED} = CONFIG;

export class UserValidator {
	static requiredCamps = [
		'firstName',
		'lastName',
		'dateBirth',
		'email',
		'password',
	];
	static validateEmail(email) {
		const regEx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!regEx.test(email)) {
			throw new InvalidEmailError();
		}
	}
	static validatePassword(password) {
		const regEx = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/; // mínimo 8 caracteres, 1 minúscula, 1 mayúscula, 1 número, sin caracteres especiales
		if (!regEx.test(password)) {
			throw new WeakPasswordError();
		}
	}
	static validateDateBirth(dateBirth) {
		const userAge =
			new Date().getFullYear() - new Date(dateBirth).getFullYear();
		const isValidDateBirth = userAge > AGE_REQUIRED && userAge < 120;
		if (!isValidDateBirth) {
			throw new InvalidDateBirthError();
		}
	}
}
