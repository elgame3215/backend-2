import { CartsService } from '../db/services/cart.service.js';
import { InternalServerError } from '../errors/generic.errors.js';
import { Strategy as LocalStrategy } from 'passport-local';
import passport from 'passport';
import { UsersService } from '../db/services/user.service.js';
import { comparePassword, hashPassword } from '../utils/hash.js';
import {
	existingEmailError,
	InvalidCredentialsError,
} from '../errors/user.errors.js';

export function initializePassportLocal() {
	passport.use(
		'login',
		new LocalStrategy(
			{
				usernameField: 'email',
				passwordField: 'password',
				session: false,
			},
			async function (email, password, done) {
				const user = await UsersService.findUserByEmail(email);
				if (!user || !(await comparePassword(password, user.password))) {
					return done(new InvalidCredentialsError(), false);
				}
				return done(null, user);
			}
		)
	);
	passport.use(
		'register',
		new LocalStrategy(
			{
				usernameField: 'email',
				passwordField: 'password',
				passReqToCallback: true,
				session: false,
			},
			async function (req, email, password, done) {
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
				});
				return done(null, newUser);
			}
		)
	);
}
