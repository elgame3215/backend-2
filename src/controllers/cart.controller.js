import { CartsService } from '../db/services/cart.service.js';
import { sendSuccess } from '../utils/customResponses.js';
import {
	InternalServerError,
	UnauthorizedError,
} from '../errors/generic.errors.js';

export class CartController {
	/**
	 *
	 * @param {Request} req
	 * @param {Response} res
	 */
	static async createCart(req, res) {
		try {
			const addedCart = await CartsService.addCart();
			return sendSuccess(res, 201, 'Carrito creado', { addedCart });
		} catch (err) {
			console.error(err);
			return next(new InternalServerError());
		}
	}
	/**
	 *
	 * @param {Request} req
	 * @param {Response} res
	 */
	static async getCart(req, res) {
		sendSuccess(res, 200, null, { cart: req.cart });
	}
	/**
	 *
	 * @param {Request} req
	 * @param {Response} res
	 */
	static async addProduct(req, res) {
		const { pid } = req.params;
		const cid = req.user?.cart;
		if (!cid) {
			next(new UnauthorizedError());
		}
		try {
			const updatedCart = await CartsService.addProductToCart(pid, cid);
			return sendSuccess(res, 200, 'Producto añadido al carrito', {
				updatedCart,
			});
		} catch (err) {
			console.error(err);
			return next(new InternalServerError());
		}
	}
	/**
	 *
	 * @param {Request} req
	 * @param {Response} res
	 */
	static async deleteProduct(req, res) {
		const { pid } = req.params;
		const cid = req.user.cart;
		try {
			const updatedCart = await CartsService.deleteProductFromCart(pid, cid);
			return sendSuccess(res, 200, 'Producto eliminado del carrito', {
				updatedCart,
			});
		} catch (err) {
			console.error(err);
			return next(new InternalServerError());
		}
	}
	/**
	 *
	 * @param {Request} req
	 * @param {Response} res
	 */
	static async updateCart(req, res) {
		const productList = req.body;
		const { cid } = req.params;
		try {
			const updatedCart = await CartsService.updateCartProducts(
				cid,
				productList
			);
			return CartController.sendUpdatedCart(res, updatedCart);
		} catch (err) {
			console.error(err);
			return next(new InternalServerError());
		}
	}
	/**
	 *
	 * @param {Request} req
	 * @param {Response} res
	 */
	static async updateProductQuantity(req, res) {
		const { cid, pid } = req.params;
		const { quantity } = req.body;
		try {
			const updatedCart = await CartsService.updateProductQuantity(
				cid,
				pid,
				quantity
			);
			return CartController.sendUpdatedCart(res, updatedCart);
		} catch (err) {
			console.error(err);
			next(new InternalServerError());
		}
	}
	/**
	 *
	 * @param {Request} req
	 * @param {Response} res
	 */
	static async clearCart(req, res) {
		const { cid } = req.params;
		try {
			const updatedCart = await CartsService.clearCart(cid);
			return CartController.sendUpdatedCart(res, updatedCart);
		} catch (err) {
			console.error(err);
			next(new InternalServerError());
		}
	}

	/**
	 *
	 * @param {Response} res
	 * @param {Object} updatedCart
	 */
	static sendUpdatedCart(res, updatedCart) {
		return sendSuccess(res, 200, 'Carrito actualizado', { updatedCart });
	}
}
