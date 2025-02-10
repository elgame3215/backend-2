import { CartsService } from '../db/services/cart.service.js';
import { existingEmailError } from '../errors/user.errors.js';
import { hashPassword } from '../utils/hash.js';
import { InternalServerError } from '../errors/generic.errors.js';
import { POLICIES } from '../constants/enums/policies.js';
import { UsersService } from '../db/services/user.service.js';

export function handleRegister({ isAdmin } = {}) {
	return async function (req, email, password, done) {
		const { firstName, lastName } = req.body;
		const dateBirth = new Date(req.body.dateBirth);
		try {
			const user = await UsersService.findUserByEmail(email);
			if (user) {
				return done(new existingEmailError(), false);
			}
		} catch (err) {
			console.error(err);
			return done(new InternalServerError(), false);
		}
		const newCart = await CartsService.addCart();
		const hashedPassword = await hashPassword(password);
		const age = new Date().getFullYear() - dateBirth.getFullYear();
		const newUser = await UsersService.registerUser({
			first_name: firstName, // eslint-disable-line camelcase
			last_name: lastName, // eslint-disable-line camelcase
			email,
			age,
			password: hashedPassword,
			cart: newCart._id,
			rol: isAdmin ? POLICIES.ADMIN : POLICIES.USER,
		});
		return done(null, newUser);
	};
}
