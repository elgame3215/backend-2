import { CONFIG } from '../config/config.js';
import { Strategy as JwtStrategy } from 'passport-jwt';
import passport from 'passport';
import { UsersService } from '../db/services/user.service.js';

const { JWT_SECRET } = CONFIG;

export function initializePassportJwt() {
	passport.use(
		'jwt',
		new JwtStrategy(
			{
				secretOrKey: JWT_SECRET,
				jwtFromRequest: cookieExtractor,
			},
			async (jwtPayload, done) => {
				const { email } = jwtPayload;
				try {
					const user = await UsersService.findUserByEmail(email);
					return done(null, user);
				} catch (err) {
					console.error(err);
					return done(err);
				}
			}
		)
	);
}

function cookieExtractor(req) {
	return req.cookies?.token ?? null;
}
