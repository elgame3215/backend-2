import passport from 'passport';
import { Router } from 'express';
import { setLoginCookies } from '../utils/login.cookies.js';
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
	}),
	(req, res) => {
		if (!req.user) {
			return res.status(401).json({
				status: 'error',
				detail: UserController.errorMessages.loginError,
			});
		}
		req.session.user = {
			name: req.user.name,
			email: req.user.email,
			cart: req.user.cart,
		};
		setLoginCookies(req, res);
		return res
		.status(200)
		.json({ status: 'success', detail: 'user logged in' });
	}
);
router.post(
	'/register',
	validateName,
	validateEmail,
	validatePassword,
	passport.authenticate('register'),
	async (req, res) => {
		if (!req.user) {
			return res.status(500).json({
				status: 'error',
				error: UserController.errorMessages.serverError,
			});
		}
		const { name, email, cart } = req.user;
		req.session.user = {
			name,
			email,
			cart,
		};
		setLoginCookies(req, res);
		return res.status(201).json({ status: 'success', detail: 'registro exitoso', newUser: req.user });
	}
);

router.post('/logout', async (req, res) => {
	res.clearCookie('authStatus');
	req.session.destroy();
	res.status(200).json({ status: 'success', detail: 'user logged out' });
});