import passport from 'passport';
import { setToken } from '../utils/jwt.js';

export class UserController {
	static login(req, res) {
		return passport.authenticate('login', {
			failureMessage: true,
			session: false,
		}, (err, user) => {
			if (err) {
				return res.sendServerError();
			}
			if (!user) {
				return res.sendLoginError();
			}
			req.user = user;
			setToken(req, res);
			return res.sendSuccesfullLogin({ username: req.user.first_name });
		})(req, res);
	}

	static logout(req, res) {
		res.clearCookie('authStatus');
		res.clearCookie('token');
		res.clearCookie('username');
		return res.sendSuccesfullLogout();
	}
	static register(req, res) {
		return passport.authenticate('register', { session: false }, (err, user) => {
			if (err) {
				switch (err.error) {
					case 'serverError':
						return res.sendServerError();
					case 'existingEmail':
						return res.sendExistingEmailError();
					default:
						return res.sendServerError();
				}
			}
			req.user = user;
			setToken(req, res);
			return res.sendSuccesfullRegister({ username: req.user.first_name });
		})(req, res);
	}
}
