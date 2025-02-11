import { CartsService } from '../../db/services/cart.service.js';
import { hasProduct } from '../../utils/cart.utils.js';
import { InternalServerError } from '../../errors/generic.errors.js';
import { ProductOutOfStockError } from '../../errors/product.errors.js';
import { ProductService } from '../../db/services/product.service.js';
import {
	CartNotFoundError,
	emptyCartError,
	InvalidQuantityError,
	ProductNotInCartError,
} from '../../errors/cart.errors.js';

// VALIDACIONES que dependen de la base de datos

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
		return next(new CartNotFoundError());
	}
	req.cart = cart;
	return next();
}

export async function validateNotEmptyCart(req, res, next) {
	if (!req.cart.products.length) {
		return next(new emptyCartError());
	}
	return next();
}

export async function validateProductInUserCart(req, res, next) {
	// valida que el carrito del usuario autenticado cuente con unidades del producto recibido por parámetro
	const { pid } = req.params;
	const cid = req.user.cart;
	try {
		const cart = await CartsService.getCartById(cid);
		if (!hasProduct(cart, pid)) {
			next(new ProductNotInCartError());
		}
		return next();
	} catch (err) {
		return next(new InternalServerError());
	}
}

export async function validateProductInCart(req, res, next) {
	// valida que el carrito recibido por parámetro cuente con unidades del producto recibido por parámetro
	const { cid, pid } = req.params;
	try {
		const cart = await CartsService.getCartById(cid);
		if (!hasProduct(cart, pid)) {
			next(new ProductNotInCartError());
		}
		return next();
	} catch (err) {
		return next(new InternalServerError());
	}
}

export async function validateQuantity(req, res, next) {
	const { quantity } = req.body;
	if (isNaN(quantity)) {
		next(new InvalidQuantityError());
	}
	const { pid } = req.params;
	try {
		const product = await ProductService.getProductById(pid);
		if (product.stock < quantity) {
			next(new ProductOutOfStockError(pid));
		}
		return next();
	} catch (err) {
		return next(new InternalServerError());
	}
}
