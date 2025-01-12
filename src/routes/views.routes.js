import { CartController } from '../dao/controllers/cart.controller.js';
import { formatResponse } from '../utils/query.process.js';
import passport from 'passport';
import { ProductController } from '../dao/controllers/product.controller.js';
import { Router } from 'express';
import { validateQuery } from '../middleware/query.validate.js';

export const router = Router();

router.get('/products', validateQuery, async (req, res) => {
	const { limit, page, sort, query } = req.query;
	try {
		const response = await ProductController.getProducts(
			limit,
			page,
			sort,
			query
		);
		formatResponse(response, limit, page, sort, query);
		res.status(200).render('products', { response });
	} catch (err) {
		console.error(err);
		res.status(500).render('error', {
			error: ProductController.errorMessages.serverError,
			code: 500,
		});
	}
});

router.get('/realtimeproducts', validateQuery, async (req, res) => {
	try {
		const { limit, page, sort, query } = req.query;
		const response = await ProductController.getProducts(
			limit,
			page,
			sort,
			query
		);
		formatResponse(response, limit, page, sort, query);
		res.status(200).render('realTimeProducts', { response });
	} catch (err) {
		console.error(err);
		res.status(500).render('error', {
			error: ProductController.errorMessages.serverError,
			code: 500,
		});
	}
});

router.get(
	'/mycart',
	passport.authenticate('jwt', { session: false }),
	async (req, res) => {
		const cartId = req.user.cart;
		try {
			const cart = await CartController.getCartById(cartId);
			const { products } = cart;
			res.status(200).render('cart', { products, cartId });
		} catch (err) {
			console.error(err);
			res.status(500).render('error', {
				error: ProductController.errorMessages.serverError,
				code: 500,
			});
		}
	}
);

router.get('/login', async (req, res) => {
	if (req.cookies.user) {
		res.redirect('/');
	}
	res.render('login');
});

router.get('/register', async (req, res) => {
	res.render('register');
});

router.get('/', (req, res) => {
	res.redirect('/products');
});
