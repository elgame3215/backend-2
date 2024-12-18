import { CartController } from '../dao/controllers/cart.controller.js';
import { ProductController } from '../dao/controllers/product.controller.js';

export async function validateCartExists(req, res, next) {
	const cid = req.session.user.cart;
	const cart = await CartController.getCartById(cid);
	if (!cart) {
		return res.status(404).json({
			status: 'error',
			detail: CartController.errorMessages.cartNotFound,
		});
	}
	return next();
}

export async function validateCartExistsView(req, res, next) {
	const cid = req.session.user.cart;
	const cart = await CartController.getCartById(cid);
	if (!cart) {
		return res.status(404).render('error', {
			error: CartController.errorMessages.cartNotFound,
			code: 404,
		});
	}
	return next();
}

export async function validateProductInCart(req, res, next) {
	const { pid } = req.params;
	const cid = req.session.user.cart;
	const cart = await CartController.getCartById(cid);
	if (!cart.products.find(p => p.product._id == pid)) {
		return res.status(404).json({
			status: 'error',
			detail: ProductController.errorMessages.productNotFound,
		});
	}
	return next();
}

export async function validateQuantity(req, res, next) {
	const { quantity } = req.body;
	if (!quantity) {
		return res
			.status(400)
			.json({ status: 'error', detail: 'quantity required' });
	}
	if (isNaN(quantity)) {
		return res
			.status(400)
			.json({ status: 'error', detail: 'quantity must be a number' });
	}
	const { pid } = req.params;
	const product = await ProductController.getProductById(pid);
	if (product.stock < quantity) {
		return res.status(400).json({
			status: 'error',
			detail: ProductController.errorMessages.productOutOfStock,
		});
	}
	return next();
}
