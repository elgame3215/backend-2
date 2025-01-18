import { CartsService } from '../db/services/cart.service.js';
import { hasProduct } from './utils.js';
import { ProductOutOfStockError } from '../errors/product.errors.js';
import { ProductService } from '../db/services/product.service.js';
import { CartNotFoundError, InvalidQuantityError, ProductNotInCartError } from '../errors/cart.errors.js';

export async function validateUserCartExists(req, res, next) {
	const cid = req.user.cart;
	const cart = await CartsService.getCartById(cid);
	if (!cart) {
		next(new CartNotFoundError());
	}
	return next();
}

export async function validateCartExists(req, res, next) {
	const { cid } = req.params;
	const cart = await CartsService.getCartById(cid);
	if (!cart) {
		next(new CartNotFoundError());
	}
	req.cart = cart;
	return next();
}

export async function validateProductInUserCart(req, res, next) {
	// valida que el carrito del usuario autenticado cuente con unidades del producto recibido por parámetro
	const { pid } = req.params;
	const cid = req.user.cart;
	const cart = await CartsService.getCartById(cid);
	if (!hasProduct(cart, pid)) {
		next(new ProductNotInCartError());
	}
	return next();
}

export async function validateProductInCart(req, res, next) {
	// valida que el carrito recibido por parámetro cuente con unidades del producto recibido por parámetro
	const { cid, pid } = req.params;
	const cart = await CartsService.getCartById(cid);
	if (!hasProduct(cart, pid)) {
		next(new ProductNotInCartError());
	}
	return next();
}

export async function validateQuantity(req, res, next) {
	const { quantity } = req.body;
	if (isNaN(quantity)) {
		next(new InvalidQuantityError());
	}
	const { pid } = req.params;
	const product = await ProductService.getProductById(pid);
	if (product.stock < quantity) {
		next(new ProductOutOfStockError());
	}
	return next();
}
