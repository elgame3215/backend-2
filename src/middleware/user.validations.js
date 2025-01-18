import { UserValidator } from '../utils/User.validator.js';

export function validateUser(req, res, next) {
	const { email, password, dateBirth } = req.body;
	try {
		UserValidator.validateEmail(email);
		UserValidator.validatePassword(password);
		UserValidator.validateDateBirth(dateBirth);
		next();
	} catch (err) {
		next(err);
	}
}
