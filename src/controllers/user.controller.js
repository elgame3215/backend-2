import passport from 'passport';
import { sendSuccess } from '../utils/customResponses.js';
import { setToken } from '../utils/jwt.js';
import { userResSchema } from '../dtos/user/res.user.dto.js';

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
				return sendSuccess({
					res,
					next,
					code: 200,
					detail: 'Sesión iniciada',
					payload: user,
					dtoSchema: userResSchema,
				});
			}
		)(req, res);
	}

	static logout(req, res, next) {
		res.clearCookie('token');
		return sendSuccess({ res, next, code: 200, detail: 'Sesión cerrada' });
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
				return sendSuccess({
					res,
					next,
					code: 200,
					detail: 'Registro exitoso',
					payload: user,
					dtoSchema: userResSchema,
				});
			}
		)(req, res);
	}
}
