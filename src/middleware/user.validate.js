import { UserController } from '../dao/controllers/user.controller.js';

export async function validateEmail(req, res, next) {
	const { email } = req.body;
	const regEx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	if (!regEx.test(email)) {
		return res.status(401).json({ status: 'error', detail: 'invalid email' });
	}
	const userExists = await UserController.findUserByEmail(email);
	if (userExists) {
		return res.status(401).json({
			status: 'error',
			detail: UserController.errorMessages.registeredEmail,
		});
	}
	return next();
}

export function validatePassword(req, res, next) {
	const { password } = req.body;
	const regEx = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/;
	if (!regEx.test(password)) {
		return res
			.status(401)
			.json({ status: 'error', detail: 'contraseña muy débil' });
	}
	return next();
}

export function validateName(req, res, next) {
	const { name } = req.body;
	if (!name.trim()) {
		return res.status(401).json({ status: 'error', detail: 'missing camps' });
	}
	return next();
}
