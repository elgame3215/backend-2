import { comparePassword } from '../utils/hash.js';
import { handleRegister } from '../utils/handleRegister.js';
import { InvalidCredentialsError } from '../errors/user.errors.js';
import { Strategy as LocalStrategy } from 'passport-local';
import passport from 'passport';
import { UsersService } from '../db/services/user.service.js';

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
			handleRegister()
		)
	);

	passport.use(
		'registerAdmin',
		new LocalStrategy(
			{
				usernameField: 'email',
				passwordField: 'password',
				passReqToCallback: true,
				session: false,
			},
			handleRegister({ isAdmin: true })
		)
	);
}
