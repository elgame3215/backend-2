import { initializePassportGithub } from '../auth/github.js';
import { initializePassportJwt } from '../auth/jwt.js';
import { initializePassportLocal } from '../auth/local.js';
import passport from 'passport';
import { UsersService } from '../db/services/user.service.js';

export function initializePassport() {
	initializePassportLocal();
	initializePassportGithub();
	initializePassportJwt();

	passport.serializeUser((user, done) => {
		done(null, user._id);
	});

	passport.deserializeUser(async (id, done) => {
		const user = await UsersService.findUserById(id);
		done(null, user);
	});
}
