import { CartsService } from '../../db/services/cart.service.js';
import { isValidObjectId } from 'mongoose';
import { ProductService } from '../../db/services/product.service.js';
import {
	BadRequestError,
	InternalServerError,
} from '../../errors/generic.errors.js';
import {
	DuplicatedProductCodeError,
	ProductNotFoundError,
	ProductOutOfStockError,
} from '../../errors/product.errors.js';

export async function validateUniqueCode(req, res, next) {
	const { code } = req.body;
	try {
		const product = await ProductService.getProductByCode(code);
		if (product) {
			return next(new DuplicatedProductCodeError());
		}
		return next();
	} catch (err) {
		return next(new InternalServerError());
	}
}

/**
 *
 * @throws `ReferenceError` si `req.user === undefined`
 */
export async function validateProductIsAvailable(req, res, next) {
	const { pid } = req.params;
	const cid = req.user.cart;

	try {
		const product = await ProductService.getProductById(pid);

		if (!product) {
			return next(new ProductNotFoundError(pid));
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
	} catch (err) {
		return next(new InternalServerError());
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

		try {
			const product = await ProductService.getProductById(p.product);

			if (!product) {
				return next(new ProductNotFoundError(p.product));
			}

			if (product.stock < p.quantity) {
				return next(new ProductOutOfStockError());
			}
		} catch (err) {
			return next(new InternalServerError());
		}
	}
	return next();
}
