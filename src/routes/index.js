import { cartsRouter } from './cart.routes.js';
import { CustomError } from '../errors/CustomError.js';
import { productsRouter } from './product.routes.js';
import { Router } from 'express';
import { sendError } from '../utils/customResponses.js';
import { sessionsRouter } from './auth.routes.js';
import { UnauthorizedError } from '../errors/generic.errors.js';
import { ValidationError } from 'express-joi-validations';
import { viewsRouter } from './views.routes.js';

const router = Router();

router.use('/api', (req, res, next) => {
	req.isApiReq = true;
	return next();
});
router.use('/api/carts', cartsRouter);
router.use('/api/products', productsRouter);
router.use('/api/sessions', sessionsRouter);
router.use('/', viewsRouter);

// ERROR HANDLING
// eslint-disable-next-line no-unused-vars
router.use((err, req, res, next) => {
	console.error(err);
	
	if (err instanceof ValidationError) {
		return sendError({ res, code: 400, message: err.message });
	}
	if (!(err instanceof CustomError)) {
		throw err;
	}
	if (req.isApiReq) {
		const { code, message } = err;
		sendError({
			res,
			code,
			message,
		});
	} else {
		const { code, message } = err;
		const view = err instanceof UnauthorizedError ? 'login' : 'error';
		res.status(code).render(view, { code, message });
	}
});

export { router };
