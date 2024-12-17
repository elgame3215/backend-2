import { hashPassword } from '../utils/hash.js';
import { initializePassport } from '../utils/passport.config.js';
import passport from 'passport';
import { Router } from 'express';
import { UserController } from '../dao/controllers/user.controller.js';
import {
	validateEmail,
	validateName,
	validatePassword,
} from './../middleware/user.validate.js';

initializePassport(passport);
export const router = Router();

router.post(
	'/login',
	passport.authenticate('login', {
		failureRedirect: '/login',
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
		};
		return res.status(200).redirect('/products');
	}
);
router.post(
	'/register',
	validateName,
	validateEmail,
	validatePassword,
	async (req, res) => {
		const { name, email, password, rol } = req.body;
		const hashedPassword = await hashPassword(password);
		try {
			const newUser = await UserController.registerUser({
				name,
				email,
				password: hashedPassword,
				rol,
			});
			return res.status(201).json({ status: 'success', newUser });
		} catch (err) {
			console.error(err);
			res.status(500).json({
				status: 'error',
				error: UserController.errorMessages.serverError,
			});
		}
	}
);

router.post('/logout', async (req, res) => {
	req.session.destroy();
	res.status(200).json({ status: 'success', detail: 'user logged out' });
});
