import { CartsService } from '../db/services/cart.service.js';
import { CONFIG } from '../config/config.js';
import { Strategy as GitHubStrategy } from 'passport-github2';
import passport from 'passport';
import { UsersService } from '../db/services/user.service.js';

const { GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET } = CONFIG;

export function initializePassportGithub() {
	passport.use(
		'github',
		new GitHubStrategy(
			{
				clientID: GITHUB_CLIENT_ID,
				clientSecret: GITHUB_CLIENT_SECRET,
				callbackURL: `/api/sessions/github-callback`,
				scope: ['user:email'],
			},
			async (accessToken, refreshToken, profile, done) => {
				const email = profile.emails[0].value;
				const user = await UsersService.findUserByEmail(email);
				if (user) {
					return done(null, user);
				}
				const fullName = profile.displayName.split(' ');
				const [firstName] = fullName;
				const [lastName] = fullName.slice(-1); // asumiendo que [profile.displayName] contiene el apellido al final
				const newCart = await CartsService.addCart();

				const newUser = await UsersService.registerUser({
					first_name: firstName, // eslint-disable-line camelcase
					last_name: lastName, // eslint-disable-line camelcase
					email,
					githubId: profile.id,
					cart: newCart._id,
					age: CONFIG.AGE_REQUIRED, // edad por defecto al registrarse con github
				});
				return done(null, newUser);
			}
		)
	);
}
