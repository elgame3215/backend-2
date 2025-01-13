import passport from 'passport';
import { POLICIES } from '../config/config.js';
import { Router } from './router.js';
import { setLoginCookies } from '../utils/login.cookies.js';
import { setToken } from '../utils/jwt.js';
import {
	validateEmail,
	validateName,
	validatePassword,
} from './../middleware/user.validate.js';

class SessionsRouter extends Router {
	constructor() {
		super();
		this.customResponses = {
			...this.customResponses,
			sendLoginError() {
				return this.status(401).json({
					status: 'error',
					detail: 'failed to log in, invalid credentials',
				});
			},
			sendExistingEmailError() {
				return this.status(400).json({
					status: 'error',
					detail: 'email already registered',
				});
			},
			sendSuccesfullLogout() {
				return this.status(200).json({
					status: 'success',
					detail: 'logout succesfull',
				});
			},
			sendSuccesfullLogin() {
				return this.status(200).json({
					status: 'success',
					detail: 'login succesfull',
				});
			},
		};
		this.init();
	}
	login(req, res) {
		if (!req.user) {
			return res.sendLoginError();
		}
		setToken(req, res);
		setLoginCookies(req, res);
		return res.sendSuccesfullLogin();
	}
	logout(req, res) {
		res.clearCookie('authStatus');
		res.clearCookie('token');
		res.clearCookie('username');
		return res.sendSuccesfullLogout();
	}
	register(req, res) {
		if (!req.user) {
			return res.sendExistingEmailError();
		}
		setToken(req, res);
		setLoginCookies(req, res);
		return res.status(201).json({
			status: 'success',
			detail: 'registro exitoso',
			newUser: req.user,
		});
	}
	init() {
		this.post(
			'/login',
			[POLICIES.public],
			passport.authenticate('login', {
				failureMessage: true,
				session: false,
			}),
			this.login
		);
		this.post(
			'/register',
			[POLICIES.public],
			validateName,
			validateEmail,
			validatePassword,
			passport.authenticate('register', { session: false }),
			this.register
		);

		this.post('/logout', [POLICIES.public], async (req, res) => {
			res.clearCookie('authStatus');
			res.clearCookie('token');
			res.clearCookie('username');
			res.status(200).json({ status: 'success', detail: 'sesión cerrada' });
		});

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
				setLoginCookies(req, res);
				res.redirect('/');
			}
		);
	}
}
const router = new SessionsRouter().router;
export const sessionsRouter = router;
