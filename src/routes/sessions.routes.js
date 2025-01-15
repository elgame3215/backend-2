import passport from 'passport';
import { POLICIES } from '../config/config.js';
import { Router } from './router.js';
import { setToken } from '../utils/jwt.js';
import { UserController } from './../controllers/user.controller.js';
import {
	validateDateBirth,
	validateEmail,
	validateName,
	validatePassword,
} from './../middleware/user.validate.js';

class SessionsRouter extends Router {
	constructor() {
		super();
		this.customResponses = {
			sendLoginError() {
				return this.status(401).json({
					status: 'error',
					detail: 'Credenciales inválidas',
				});
			},
			sendExistingEmailError() {
				return this.status(400).json({
					status: 'error',
					detail: 'Ya existe una cuenta con ese email',
				});
			},
			sendInvalidAgeError() {
				return this.status(400).json({
					status: 'error',
					detail: 'Edad inválida',
				});
			},
			sendSuccesfullLogout() {
				return this.status(200).json({
					status: 'success',
					detail: 'Sesión cerrada',
				});
			},
			sendSuccesfullLogin(payload) {
				return this.status(200).json({
					status: 'success',
					detail: 'Sesión iniciada',
					payload,
				});
			},
			sendSuccesfullRegister(payload) {
				return this.status(201).json({
					status: 'success',
					detail: 'Registro exitoso',
					payload,
				});
			},
			...this.customResponses,
		};
		this.init();
	}

	init() {
		this.post(
			'/login',
			[POLICIES.public],
			UserController.login
		);
		this.post(
			'/register',
			[POLICIES.public],
			validateName,
			validateEmail,
			validatePassword,
			validateDateBirth,
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
			res.sendSuccess(req.user);
		});
	}
}

export const sessionsRouter = new SessionsRouter().router;
