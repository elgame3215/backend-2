import { CartsService } from '../db/services/cart.service.js';
import { formatResponse } from '../utils/query.process.js';
import { InternalServerError, NotFoundError } from '../errors/GenericErrors.js';
import { POLICIES } from '../config/config.js';
import { ProductService } from '../db/services/product.service.js';
import { Router } from './router.js';
import { validateQuery } from '../middleware/query.validations.js';

class ViewsRouter extends Router {
	constructor() {
		super();
		this.init();
	}
	init() {
		this.get(
			'/products',
			[POLICIES.public],
			validateQuery,
			async (req, res) => {
				const { limit, page, sort, query } = req.query;
				const { username } = req.query;
				try {
					const response = await ProductService.getProducts(
						limit,
						page,
						sort,
						query
					);
					formatResponse(response, limit, page, sort, query);
					res.status(200).render('products', { response, username });
				} catch (err) {
					console.error(err);
					next(new InternalServerError());
				}
			}
		);

		this.get(
			'/realtimeproducts',
			[POLICIES.admin],
			validateQuery,
			async (req, res) => {
				try {
					const { limit, page, sort, query } = req.query;
					const response = await ProductService.getProducts(
						limit,
						page,
						sort,
						query
					);
					formatResponse(response, limit, page, sort, query);
					res.status(200).render('realTimeProducts', { response });
				} catch (err) {
					console.error(err);
					next(new InternalServerError());
				}
			}
		);

		this.get('/mycart', [POLICIES.user, POLICIES.admin], async (req, res) => {
			const cartId = req.user.cart;
			try {
				const cart = await CartsService.getCartById(cartId);
				const { products } = cart;
				res.status(200).render('cart', { products, cartId });
			} catch (err) {
				console.error(err);
				next(new InternalServerError());
			}
		});

		this.get('/login', [POLICIES.public], (req, res) => {
			if (req.user) {
				res.redirect('/');
			}
			res.render('login');
		});

		this.get('/register', [POLICIES.public], (req, res) => {
			res.render('register');
		});

		this.get('/', [POLICIES.public], (req, res) => {
			res.redirect('/products');
		});

		this.get('/*', [POLICIES.public], (req, res, next) => {
			next(new NotFoundError());
		});
	}
}

export const viewsRouter = new ViewsRouter().router;
