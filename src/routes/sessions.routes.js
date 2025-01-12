import passport from 'passport';
import { Router } from 'express';
import { setLoginCookies } from '../utils/login.cookies.js';
import { setToken } from '../utils/jwt.js';
import { UserController } from '../dao/controllers/user.controller.js';
import {
	validateEmail,
	validateName,
	validatePassword,
} from './../middleware/user.validate.js';

export const router = Router();
router.post(
	'/login',
	passport.authenticate('login', {
		failureMessage: true,
		session: false,
	}),
	(req, res) => {
		if (!req.user) {
			return res.status(401).json({
				status: 'error',
				detail: UserController.errorMessages.loginError,
			});
		}
		setToken(req, res);
		setLoginCookies(req, res);
		return res.status(200).json({
			status: 'success',
			detail: `sesión iniciada como ${req.user.name}`,
		});
	}
);
router.post(
	'/register',
	validateName,
	validateEmail,
	validatePassword,
	passport.authenticate('register', { session: false }),
	async (req, res) => {
		if (!req.user) {
			return res.status(500).json({
				status: 'error',
				error: UserController.errorMessages.serverError,
			});
		}
		setToken(req, res);
		setLoginCookies(req, res);
		return res.status(201).json({
			status: 'success',
			detail: 'registro exitoso',
			newUser: req.user,
		});
	}
);

router.post('/logout', async (req, res) => {
	res.clearCookie('authStatus');
	res.clearCookie('token');
	res.clearCookie('username');
	res.status(200).json({ status: 'success', detail: 'sesión cerrada' });
});

router.get('/github', passport.authenticate('github', { session: false }));

router.get(
	'/github-callback',
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
