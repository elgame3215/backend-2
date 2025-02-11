import { CartsService } from '../../db/services/cart.service.js';
import { InternalServerError } from '../../errors/generic.errors.js';
import { ProductService } from '../../db/services/product.service.js';
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
 * @middleware `validateUserCartExists`
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
			return next(new ProductOutOfStockError(pid));
		}

		const cart = await CartsService.getCartById(cid);
		const productInCart = cart.products.find(p => p.product._id == pid);

		if (!productInCart) {
			return next();
		}

		if (product.stock <= productInCart.quantity) {
			return next(new ProductOutOfStockError(pid));
		}
	} catch (err) {
		return next(new InternalServerError());
	}

	return next();
}

export async function validateProductsStock(req, res, next) {
	const productList = req.body;

	for (const p of productList) {
		try {
			const product = await ProductService.getProductById(p.product);

			if (!product) {
				return next(new ProductNotFoundError(p.product));
			}

			if (product.stock < p.quantity) {
				return next(new ProductOutOfStockError(p.product));
			}
		} catch (err) {
			return next(new InternalServerError());
		}
	}
	return next();
}

export function validateProductsInCartStock(req, res, next) {
	const { products } = req.cart;
	const outOfStockProducts = products.filter(
		p => p.product.stock < p.quantity
	);
	if (outOfStockProducts.length) {
		return next(
			new ProductOutOfStockError(outOfStockProducts.map(p => p.product.id))
		);
	}
	return next();
}
