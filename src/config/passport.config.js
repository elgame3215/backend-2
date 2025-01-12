import { CartController } from '../dao/controllers/cart.controller.js';
import GitHubStrategy from 'passport-github2';
import { Strategy as LocalStrategy } from 'passport-local';
import passport from 'passport';
import { UserController } from '../dao/controllers/user.controller.js';
import { comparePassword, hashPassword } from './../utils/hash.js';
import { ExtractJwt, Strategy as JwtStrategy } from 'passport-jwt';
import { PORT, SECRET } from './config.js';

export function initializePassport() {
	passport.use(
		'login',
		new LocalStrategy(
			{
				usernameField: 'email',
				passwordField: 'password',
				session: false,
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
		new LocalStrategy(
			{
				usernameField: 'email',
				passwordField: 'password',
				passReqToCallback: true,
				session: false,
			},
			async function (req, email, password, done) {
				const { name, rol } = req.body;
				const user = await UserController.findUserByEmail(email);
				if (user) {
					return done(null, false);
				}
				const newCart = await CartController.addCart();
				const hashedPassword = await hashPassword(password);
				const newUser = await UserController.registerUser({
					name,
					email,
					password: hashedPassword,
					rol,
					cart: newCart._id,
				});
				return done(null, newUser);
			}
		)
	);

	// VARIABLES DE ENTORNO
	const GITHUB_CLIENT_ID = 'Iv23lic2BRheNPmq977w';
	const GITHUB_CLIENT_SECRET = 'ec2b96bd7652c9c574a91c2093d03e6f3cb5f34f';

	passport.use(
		'github',
		new GitHubStrategy(
			{
				clientID: GITHUB_CLIENT_ID,
				clientSecret: GITHUB_CLIENT_SECRET,
				callbackURL: `http://localhost:${PORT}/api/sessions/github-callback`,
				scope: ['user:email'],
			},
			async (accessToken, refreshToken, profile, done) => {
				const email = profile.emails[0].value;
				const user = await UserController.findUserByEmail(email);
				if (user) {
					return done(null, user);
				}
				const newCart = await CartController.addCart();
				const newUser = await UserController.registerUser({
					name: profile._json.name,
					email,
					githubId: profile.id,
					cart: newCart._id,
				});
				return done(null, newUser);
			}
		)
	);

	passport.use(
		new JwtStrategy(
			{
				secretOrKey: SECRET,
				jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
			},
			async (jwtPayload, done) => {
				// VALIDAR PERMISOS DEL USUARIO
				const { email } = jwtPayload;
				const user = await UserController.findUserByEmail(email);
				return done(null, user);
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

function cookieExtractor(req) {
	return req.cookies?.token ?? null;
}
