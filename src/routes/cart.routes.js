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
	async getCart(req, res) {
		const { cid } = req.params;
		try {
			const cart = await CartController.getCartById(cid);
			if (!cart) {
				return res.sendCartNotFound();
			}
			return res.sendSuccess(cart);
		} catch (err) {
			console.error(err);
			return res.sendServerError();
		}
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
			validatePid,
			validateUserCartExists,
			validateProductIsAviable,
			this.addProduct
		);

		this.delete(
			'/mycart/product/:pid',
			[POLICIES.user, POLICIES.admin],
			validatePid,
			validateUserCartExists,
			validateProductInUserCart,
			this.deleteProduct
		);

		this.put(
			'/:cid',
			[POLICIES.user, POLICIES.admin],
			validateCid,
			validateCartExists,
			validateBodyPids,
			this.updateCart
		);

		this.put(
			'/:cid/product/:pid',
			[POLICIES.user, POLICIES.admin],
			validateCid,
			validatePid,
			validateCartExists,
			validateProductInCart,
			validateQuantity,
			this.updateProductQuantity
		);

		this.delete(
			'/:cid',
			[POLICIES.user, POLICIES.admin],
			validateCid,
			validateCartExists,
			this.clearCart
		);
	}
}

export const cartsRouter = new CartsRouter().router;
