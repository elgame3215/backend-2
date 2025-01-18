import { BadRequestError } from '../errors/GenericErrors.js';
import { CartsService } from '../db/services/cart.service.js';
import { isValidObjectId } from 'mongoose';
import { ProductService } from '../db/services/product.service.js';
import { ProductValidator } from '../utils/Product.validator.js';
import {
	ProductNotFoundError,
	ProductOutOfStockError,
} from '../errors/ProductErrors.js';

export async function validateProduct(req, res, next) {
	const product = req.body;
	try {
		ProductValidator.validateValues(product);
		await ProductValidator.validateCode(product);
		return next();
	} catch (err) {
		req.io.emit('invalid product', err.message);
		next(new BadRequestError(err.message));
	}
}

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
