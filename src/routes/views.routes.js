import { CartsService } from '../db/services/cart.service.js';
import { POLICIES } from '../constants/enums/policies.js';
import { productListSchema } from '../dtos/product/res.products.list.dto.js';
import { ProductService } from '../db/services/product.service.js';
import { queryReqSchema } from '../dtos/req.query.dto.js';
import { Router } from './Router.js';
import { validateQuery } from 'express-joi-validations';
import {
	InternalServerError,
	NotFoundError,
} from '../errors/generic.errors.js';

class ViewsRouter extends Router {
	constructor() {
		super();
		this.init();
	}
	init() {
		this.get(
			'/products',
			[POLICIES.PUBLIC],
			validateQuery(queryReqSchema, { stripUnknown: true }),
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
					res.status(200).render('products', {
						response: productListSchema.validate(response).value,
						username,
					});
				} catch (err) {
					console.error(err);
					next(new InternalServerError());
				}
			}
		);

		this.get(
			'/realtimeproducts',
			[POLICIES.ADMIN],
			validateQuery(queryReqSchema),
			async (req, res) => {
				try {
					const { limit, page, sort, query } = req.query;
					const response = await ProductService.getProducts(
						limit,
						page,
						sort,
						query
					);
					res.status(200).render('realTimeProducts', {
						response: productListSchema.validate(response).value,
					});
				} catch (err) {
					console.error(err);
					next(new InternalServerError());
				}
			}
		);

		this.get('/my-cart', [POLICIES.USER], async (req, res) => {
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

		this.get('/register', [POLICIES.PUBLIC], (req, res) => {
			res.render('register');
		});

		this.get('/login', [POLICIES.PUBLIC], (req, res) => {
			res.render('login');
		});

		this.get('/', [POLICIES.PUBLIC], (req, res) => {
			res.redirect('/products');
		});

		this.get('/*', [POLICIES.PUBLIC], (req, res, next) => {
			next(new NotFoundError());
		});
	}
}

export const viewsRouter = new ViewsRouter().router;
