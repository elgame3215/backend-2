import { Router as ExpressRouter } from 'express';

export class Router {
	constructor() {
		this.router = ExpressRouter();
		this.init();
	}
	init() {}
	generateCustomResponses(req, res, next) {
		const errorPayload = { status: 'error' };
		const successPayload = { status: 'success' };
		res.sendSuccess = (status, message) => {
			res.status(status).json({ ...successPayload, message });
		};
		res.sendError = (status, message) => {
			res.status(status).json({ ...errorPayload, message });
		};
		res.sendUnauthorized = () => {
			res.status(401).json({ ...errorPayload, message: 'Unauthorized' });
		};
		res.sendServerError = () => {
			res
				.status(500)
				.json({ ...errorPayload, message: 'Internal server error' });
		};
		return next();
	}
}
