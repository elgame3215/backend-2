import passport from 'passport';
import { Strategy } from 'passport-local';
import { UserController } from '../dao/controllers/user.controller.js';
import { comparePassword, hashPassword } from './hash.js';

export function initializePassport() {
	passport.use(
		'login',
		new Strategy(
			{
				usernameField: 'email',
				passwordField: 'password',
			},
			async function (email, password, done) {
				const user = await UserController.findUserByEmail(email);
				if (!user || !(await comparePassword(password, user.password))) {
					return done(null, false, {
						message: UserController.errorMessages.loginError,
					});
				}
				return done(null, user);
			}
		)
	);
	passport.use(
		'register',
		new Strategy(
			{
				usernameField: 'email',
				passwordField: 'password',
				passReqToCallback: true,
			},
			async function (req, email, password, done) {
				const { name, rol } = req.body;
				const user = await UserController.findUserByEmail(email);
				if (user) {
					return done(null, false);
				}
				const newUser = UserController.registerUser({
					name,
					email,
					password: await hashPassword(password),
					rol,
				});
				return done(null, newUser);
			}
		)
	);

	passport.serializeUser((user, done) => {
		done(null, user._id);
	});

	passport.deserializeUser(async (id, done) => {
		const user = await UserController.findUserById(id);
		done(null, user);
	});
}
