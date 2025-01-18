import passport from 'passport';
import { POLICIES } from '../config/config.js';
import { Router } from './Router.js';
import { sendSuccess } from '../utils/customResponses.js';
import { setToken } from '../utils/jwt.js';
import { UserController } from './../controllers/user.controller.js';
import { UserValidator } from '../utils/User.validator.js';
import { validateCamps } from '../middleware/generic.validations.js';
import { validateUser } from '../middleware/user.validations.js';

class SessionsRouter extends Router {
	constructor() {
		super();
	}

	init() {
		this.post('/login', [POLICIES.public], UserController.login);
		this.post(
			'/register',
			[POLICIES.public],
			validateCamps(UserValidator.requiredCamps),
			validateUser,
			UserController.register
		);

		this.post('/logout', [POLICIES.public], UserController.logout);

		this.get(
			'/github',
			[POLICIES.public],
			passport.authenticate('github', { session: false })
		);

		this.get(
			'/github-callback',
			[POLICIES.public],
			passport.authenticate('github', { session: false }),
			async (req, res) => {
				if (!req.user) {
					return res.redirect('/login');
				}
				setToken(req, res);
				res.redirect(`/products?username=${req.user.first_name}`);
			}
		);

		this.get('/current', [POLICIES.user, POLICIES.admin], async (req, res) => {
			sendSuccess(res, 200, null, {payload: req.user});
		});
	}
}

export const sessionsRouter = new SessionsRouter().router;
