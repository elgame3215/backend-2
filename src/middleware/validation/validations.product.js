import { BadRequestError } from '../../errors/generic.errors.js';
import { CartsService } from '../../db/services/cart.service.js';
import { isValidObjectId } from 'mongoose';
import { ProductService } from '../../db/services/product.service.js';
import {
	ProductNotFoundError,
	ProductOutOfStockError,
} from '../../errors/product.errors.js';

/**
 *
 * @throws `ReferenceError` si `req.user === undefined`
 */
export async function validateProductIsAvailable(req, res, next) {
	const { pid } = req.params;
	const cid = req.user.cart;

	const product = await ProductService.getProductById(pid);

	if (!product) {
		return next(new ProductNotFoundError());
	}

	if (product.stock < 1) {
		return next(new ProductOutOfStockError());
	}

	const cart = await CartsService.getCartById(cid);
	const productInCart = cart.products.find(p => p.product._id == pid);

	if (!productInCart) {
		return next();
	}

	if (product.stock <= productInCart.quantity) {
		return next(new ProductOutOfStockError());
	}

	return next();
}

export async function validateBodyPids(req, res, next) {
	const productList = req.body;

	if (!Array.isArray(productList)) {
		return next(new BadRequestError('Array esperado'));
	}

	for (const p of productList) {
		if (!(Object.hasOwn(p, 'product') && Object.hasOwn(p, 'quantity'))) {
			return next(new BadRequestError('Formato inválido'));
		}

		if (!isValidObjectId(p.product)) {
			return next(new BadRequestError('PID inválido'));
		}

		if (isNaN(p.quantity) || p.quantity < 1) {
			return next(
				new BadRequestError(
					`La cantidad del producto ${p.product} debe ser un número mayor a 0`
				)
			);
		}

		const product = await ProductService.getProductById(p.product);

		if (!product) {
			return next(new ProductNotFoundError(p.product));
		}

		if (product.stock < p.quantity) {
			return next(new ProductOutOfStockError());
		}
	}
	return next();
}
