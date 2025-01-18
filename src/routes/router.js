import { Router as ExpressRouter } from 'express';
import passport from 'passport';
import { POLICIES } from '../config/config.js';
import { UnauthorizedError } from '../errors/GenericErrors.js';

export class Router {
	constructor() {
		this.router = ExpressRouter();
	}
	handlePolicies(policies) {
		return async (req, res, next) => {
			if (policies.includes(POLICIES.public)) {
				return next();
			}
			passport.authenticate('jwt', { session: false }, (err, user) => {
				if (!policies.includes(user.rol)) {
					return next(new UnauthorizedError());
				}
				req.user = user;
				return next(); // [next] es la misma funcion en ambos scopes, si no se invoca dentro del callback de passport no funciona. Es feo, pero es lo que hay
			})(req, res, next);
			return;
		};
	}

	get(path, policies, ...callbacks) {
		this.router.get(
			path,
			this.handlePolicies(policies),
			...callbacks
		);
	}
	post(path, policies, ...callbacks) {
		this.router.post(
			path,
			this.handlePolicies(policies),
			...callbacks
		);
	}
	put(path, policies, ...callbacks) {
		this.router.put(
			path,
			this.handlePolicies(policies),
			...callbacks
		);
	}
	delete(path, policies, ...callbacks) {
		this.router.delete(
			path,
			this.handlePolicies(policies),
			...callbacks
		);
	}

	param(param, ...callbacks) {
		this.router.param(param, ...callbacks);
	}
}
