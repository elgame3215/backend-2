import { cartResSchema } from '../dtos/cart/res.cart.dto.js';
import { CartsService } from '../db/services/cart.service.js';
import { ProductService } from '../db/services/product.service.js';
import { sendSuccess } from '../utils/customResponses.js';
import { ticketResSchema } from '../dtos/ticket/res.ticket.dto.js';
import { TicketService } from '../db/services/ticket.service.js';
import {
	InternalServerError,
	UnauthorizedError,
} from '../errors/generic.errors.js';

export class CartController {
	static async createCart(req, res, next) {
		try {
			const addedCart = await CartsService.addCart();
			return sendSuccess({
				res,
				next,
				code: 201,
				detail: 'Carrito creado',
				payload: addedCart.toObject(),
				dtoSchema: cartResSchema,
			});
		} catch (err) {
			console.error(err);
			return next(new InternalServerError());
		}
	}

	static getCart(req, res, next) {
		const cart = req.cart;
		return sendSuccess({
			res,
			next,
			code: 200,
			payload: cart,
			dtoSchema: cartResSchema,
		});
	}

	static async addProduct(req, res, next) {
		const { pid } = req.params;
		const cid = req.user?.cart;
		if (!cid) {
			next(new UnauthorizedError());
		}
		try {
			const updatedCart = await CartsService.addProductToCart(pid, cid);
			return sendSuccess({
				res,
				next,
				code: 200,
				detail: 'Producto añadido al carrito',
				payload: updatedCart,
				dtoSchema: cartResSchema,
			});
		} catch (err) {
			console.error(err);
			return next(new InternalServerError());
		}
	}

	static async deleteProduct(req, res, next) {
		const { pid } = req.params;
		const cid = req.user.cart;
		try {
			const updatedCart = await CartsService.deleteProductFromCart(pid, cid);
			return sendSuccess({
				res,
				next,
				code: 200,
				detail: 'Producto eliminado del carrito',
				payload: updatedCart,
				dtoSchema: cartResSchema,
			});
		} catch (err) {
			console.error(err);
			return next(new InternalServerError());
		}
	}

	static async purchase(req, res, next) {
		const { products } = req.cart;
		try {
			await ProductService.reduceAmounts(products);

			const ticket = await TicketService.generateTicket({
				products,
				purchaser: req.user.email,
			});

			await CartsService.clearCart(req.cart.id);

			return sendSuccess({
				res,
				next,
				code: 201,
				detail: 'Compra realizada',
				payload: ticket,
				dtoSchema: ticketResSchema,
			});
		} catch (err) {
			console.error(err);
			return next(err);
		}
	}

	static async updateCart(req, res, next) {
		const productList = req.body;
		const { cid } = req.params;
		try {
			const updatedCart = await CartsService.updateCartProducts(
				cid,
				productList
			);
			return CartController.sendUpdatedCart(res, next, updatedCart);
		} catch (err) {
			console.error(err);
			return next(new InternalServerError());
		}
	}

	static async updateProductQuantity(req, res, next) {
		const { cid, pid } = req.params;
		const { quantity } = req.body;
		try {
			const updatedCart = await CartsService.updateProductQuantity(
				cid,
				pid,
				quantity
			);
			return CartController.sendUpdatedCart(res, next, updatedCart);
		} catch (err) {
			console.error(err);
			next(new InternalServerError());
		}
	}

	static async clearCart(req, res, next) {
		const { cid } = req.params;
		try {
			const updatedCart = await CartsService.clearCart(cid);
			return CartController.sendUpdatedCart(res, next, updatedCart);
		} catch (err) {
			console.error(err);
			next(new InternalServerError());
		}
	}

	static sendUpdatedCart(res, next, updatedCart) {
		return sendSuccess({
			res,
			next,
			code: 200,
			detail: 'Carrito actualizado',
			payload: updatedCart,
			dtoSchema: cartResSchema,
		});
	}
}
