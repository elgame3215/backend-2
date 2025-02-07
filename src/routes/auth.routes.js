import passport from 'passport';
import { POLICIES } from '../constants/enums/policies.js';
import { Router } from './Router.js';
import { sendSuccess } from '../utils/customResponses.js';
import { setToken } from '../utils/jwt.js';
import { UserController } from '../controllers/user.controller.js';
import { userLoginReqSchema } from '../dtos/user/req.user.login.dto.js';
import { userRegisterReqSchema } from '../dtos/user/req.user.register.dto.js';
import { userResSchema } from '../dtos/user/res.user.dto.js';
import { validateBody } from 'express-joi-validations';

class SessionsRouter extends Router {
	constructor() {
		super();
	}

	init() {
		this.post(
			'/login',
			[POLICIES.PUBLIC],
			validateBody(userLoginReqSchema),
			UserController.login
		);
		this.post(
			'/register',
			[POLICIES.PUBLIC],
			validateBody(userRegisterReqSchema),
			UserController.register
		);

		this.post('/logout', [POLICIES.PUBLIC], UserController.logout);

		this.get(
			'/github',
			[POLICIES.PUBLIC],
			passport.authenticate('github', { session: false })
		);

		this.get(
			'/github-callback',
			[POLICIES.PUBLIC],
			passport.authenticate('github', { session: false }),
			async (req, res) => {
				if (!req.user) {
					return res.redirect('/login');
				}
				setToken(req, res);
				res.redirect(`/products?username=${req.user.first_name}`);
			}
		);

		this.get(
			'/current',
			[POLICIES.USER, POLICIES.ADMIN],
			async (req, res, next) => {
				sendSuccess({
					res,
					next,
					code: 200,
					payload: req.user,
					dtoSchema: userResSchema,
				});
			}
		);
	}
}

export const sessionsRouter = new SessionsRouter().router;
