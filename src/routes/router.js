import { Router as ExpressRouter } from 'express';
import passport from 'passport';
import { POLICIES } from '../constants/enums/policies.js';
import { ForbiddenError, UnauthorizedError } from '../errors/generic.errors.js';

export class Router {
	constructor() {
		this.router = ExpressRouter();
		this.init();
	}

	handlePolicies(policies) {
		return async (req, res, next) => {
			if (policies.includes(POLICIES.PUBLIC)) {
				return next();
			}

			passport.authenticate('jwt', { session: false }, (err, user) => {
				if (!policies.includes(user?.role)) {
					const error =
						user.role == POLICIES.ADMIN
							? new ForbiddenError()
							: new UnauthorizedError();
					return next(error);
				}

				req.user = user;
				return next(); // [next] es la misma función en ambos scopes, si no se invoca dentro del callback de passport no funciona. Es feo, pero es lo que hay
			})(req, res, next);
			return;
		};
	}

	param(param, ...callbacks) {
		this.router.param(param, ...callbacks);
	}

	get(path, policies, ...callbacks) {
		this.router.get(path, this.handlePolicies(policies), ...callbacks);
	}

	post(path, policies, ...callbacks) {
		this.router.post(path, this.handlePolicies(policies), ...callbacks);
	}

	put(path, policies, ...callbacks) {
		this.router.put(path, this.handlePolicies(policies), ...callbacks);
	}

	delete(path, policies, ...callbacks) {
		this.router.delete(path, this.handlePolicies(policies), ...callbacks);
	}
}
