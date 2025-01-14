import { CONFIG } from '../config/config.js';

export async function validateEmail(req, res, next) {
	const { email } = req.body;
	const regEx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	if (!regEx.test(email)) {
		return res.status(401).json({ status: 'error', detail: 'invalid email' });
	}
	return next();
}

export function validatePassword(req, res, next) {
	const { password } = req.body;
	const regEx = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/; // mínimo 8 caracteres, 1 minúscula, 1 mayúscula, 1 número, sin caracteres especiales
	if (!regEx.test(password)) {
		return res
			.status(401)
			.json({ status: 'error', detail: 'contraseña muy débil' });
	}
	return next();
}

export function validateName(req, res, next) {
	const { firstName, lastName } = req.body;
	if (!(firstName.trim() && lastName.trim())) {
		return res.sendMissingCamps();
	}
	return next();
}

export function validateDateBirth(req, res, next) {
	const { dateBirth } = req.body;
	if (!dateBirth) {
		return res.sendMissingCamps();
	}
	const userAge = new Date().getFullYear() - new Date(dateBirth).getFullYear();
	const isValidDateBirth = userAge > CONFIG.AGE_REQUIRED && userAge < 120;
	if (!isValidDateBirth) {
		return res.sendInvalidAgeError();
	}
	return next();
}
