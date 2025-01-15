import { CartController } from '../dao/controllers/cart.controller.js';
import { POLICIES } from '../config/config.js';
import { Router } from './router.js';
import {
	validateBodyPids,
	validateProductIsAviable,
} from '../middleware/product.validate.js';
import {
	validateCartExists,
	validateProductInCart,
	validateProductInUserCart,
	validateQuantity,
	validateUserCartExists,
} from '../middleware/cart.validate.js';
import { validateCid, validatePid } from '../middleware/mongoID.validate.js';

class CartsRouter extends Router {
	constructor() {
		super();
		this.customResponses = {
			...this.customResponses,
			sendCartNotFound() {
				return this.status(404).json({
					status: 'error',
					detail: 'Carrito no encontrado',
				});
			},
			sendProductNotInCart() {
				return this.status(404).json({
					status: 'error',
					detail: 'El carrito no tiene unidades del producto',
				});
			},
		};
		this.init();
	}

	async createCart(req, res) {
		try {
			const addedCart = await CartController.addCart();
			return res.sendResourceCreated({ addedCart });
		} catch (err) {
			console.error(err);
			return res.sendServerError();
		}
	}
	async getCart(req) {
		return req.cart;	// inyectado por [validateCartExists]
	}
	async addProduct(req, res) {
		const { pid } = req.params;
		const cid = req.user?.cart;
		if (!cid) {
			res.sendUnauthorized();
		}
		try {
			const updatedCart = await CartController.addProductToCart(pid, cid);
			return res.sendSuccess({ updatedCart });
		} catch (err) {
			console.error(err);
			return res.sendServerError();
		}
	}
	async deleteProduct(req, res) {
		const { pid } = req.params;
		const cid = req.user.cart;
		try {
			const updatedCart = await CartController.deleteProductFromCart(pid, cid);
			return res.sendSuccess({ updatedCart });
		} catch (err) {
			console.error(err);
			return res.sendServerError();
		}
	}
	async updateCart(req, res) {
		const productList = req.body;
		const { cid } = req.params;
		try {
			const updatedCart = await CartController.updateCartProducts(
				cid,
				productList
			);
			return res.sendSuccess({ updatedCart });
		} catch (err) {
			console.error(err);
			return res.sendServerError();
		}
	}
	async updateProductQuantity(req, res) {
		const { cid, pid } = req.params;
		const { quantity } = req.body;
		try {
			const updatedCart = await CartController.updateProductQuantity(
				cid,
				pid,
				quantity
			);
			return res.sendSuccess({ updatedCart });
		} catch (err) {
			console.error(err);
			res.sendServerError();
		}
	}
	async clearCart(req, res) {
		const { cid } = req.params;
		try {
			const updatedCart = await CartController.clearCart(cid);
			return res.sendSuccess({ updatedCart });
		} catch (err) {
			console.error(err);
			res.sendServerError();
		}
	}

	init() {
		this.param('cid', validateCid, validateCartExists);
		// [validateCartExists] se encarga de buscar el carrito e inyectarlo en [req]
		// carga a la función con una responsabilidad de más, pero molesto a la db una única vez.

		this.param('pid', validatePid);

		this.post('/', [POLICIES.user, POLICIES.admin], this.createCart);

		this.get(
			'/:cid',
			[POLICIES.user, POLICIES.admin],
			validateCid,
			this.getCart
		);

		this.post(
			'/mycart/product/:pid',
			[POLICIES.user, POLICIES.admin],
			validateUserCartExists,
			validateProductIsAviable,
			this.addProduct
		);

		this.delete(
			'/mycart/product/:pid',
			[POLICIES.user, POLICIES.admin],
			validateUserCartExists,
			validateProductInUserCart,
			this.deleteProduct
		);

		this.put(
			'/:cid',
			[POLICIES.user, POLICIES.admin],
			validateBodyPids,
			this.updateCart
		);

		this.put(
			'/:cid/product/:pid',
			[POLICIES.user, POLICIES.admin],
			validateProductInCart,
			validateQuantity,
			this.updateProductQuantity
		);

		this.delete(
			'/:cid',
			[POLICIES.user, POLICIES.admin],
			this.clearCart
		);
	}
}

export const cartsRouter = new CartsRouter().router;
