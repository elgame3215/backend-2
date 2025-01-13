import { Router as ExpressRouter } from 'express';
import passport from 'passport';
import { POLICIES } from '../config/config.js';

export class Router {
	constructor() {
		this.router = ExpressRouter();
		this.customResponses = {
			sendSuccess(payload) {
				return this.status(200).json({ status: 'success', payload });
			},
			sendResourceCreated(payload) {
				if (typeof payload === 'object') {
					this.status(201).json({ status: 'success', ...payload });
				} else {
					return this.status(201).json({ status: 'success', payload });
				}
			},
			sendServerError() {
				return this.status(500).json({
					status: 'error',
					detail: 'Internal server error',
				});
			},
			sendUnauthorized() {
				return this.status(401).json({
					status: 'error',
					detail: 'Unauthorized',
				});
			},
			renderUnauthorized() {
				return this.render('login');
			},
			sendInvalidToken() {
				return this.status(400).json({
					status: 'error',
					detail: 'Invalid token provided',
				});
			},
		};
	}
	generateCustomResponses = (req, res, next) => {
		for (const response in this.customResponses) {
			// las custom responses son inyectadas dinámicamente en [res], tomando como [this] en cada una a la misma [res]
			res[response] = this.customResponses[response];
		}
		return next();
	};

	handlePolicies(policies) {
		return async (req, res, next) => {
			if (policies.includes(POLICIES.public)) {
				return next();
			}
			passport.authenticate('jwt', { session: false }, (err, user) => {
				if (!policies.includes(user.rol)) {
					return req.isApiReq
						? res.sendUnauthorized()
						: res.renderUnauthorized();
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
			this.generateCustomResponses,
			this.handlePolicies(policies),
			...callbacks
		);
	}
	post(path, policies, ...callbacks) {
		this.router.post(
			path,
			this.generateCustomResponses,
			this.handlePolicies(policies),
			...callbacks
		);
	}
	put(path, policies, ...callbacks) {
		this.router.put(
			path,
			this.generateCustomResponses,
			this.handlePolicies(policies),
			...callbacks
		);
	}
	delete(path, policies, ...callbacks) {
		this.router.delete(
			path,
			this.generateCustomResponses,
			this.handlePolicies(policies),
			...callbacks
		);
	}
}
