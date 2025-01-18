import passport from 'passport';
import { sendSuccess } from '../utils/customResponses.js';
import { setToken } from '../utils/jwt.js';

export class UserController {
	static login(req, res, next) {
		return passport.authenticate(
			'login',
			{
				failureMessage: true,
				session: false,
			},
			(err, user) => {
				if (err) {
					return next(err);
				}
				req.user = user;
				setToken(req, res);
				return sendSuccess(res, 200, 'Sesión iniciada', {
					username: req.user.first_name,
				});
			}
		)(req, res);
	}

	static logout(req, res) {
		res.clearCookie('token');
		return sendSuccess(res, 200, 'Sesión cerrada');
	}
	static register(req, res, next) {
		return passport.authenticate(
			'register',
			{ session: false },
			(err, user) => {
				if (err) {
					return next(err);
				}
				req.user = user;
				setToken(req, res);
				return sendSuccess(res, 200, 'Registro exitoso', {
					username: req.user.first_name,
				});
			}
		)(req, res);
	}
}
