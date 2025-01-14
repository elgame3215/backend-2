import { CartController } from '../dao/controllers/cart.controller.js';
import { ProductController } from '../dao/controllers/product.controller.js';

export async function validateUserCartExists(req, res, next) {
	const cid = req.user.cart;
	const cart = await CartController.getCartById(cid);
	if (!cart) {
		return res.sendCartNotFound();
	}
	return next();
}

export async function validateCartExists(req, res, next) {
	const { cid } = req.params;
	const cart = await CartController.getCartById(cid);
	if (!cart) {
		return res.sendCartNotFound();
	}
	return next();
}

function hasProduct(cart, pid) {
	return cart.products.find(p => p.product._id == pid);
}

export async function validateProductInUserCart(req, res, next) {
	// valida que el carrito del usuario autenticado cuente con unidades del producto recibido por parámetro
	const { pid } = req.params;
	const cid = req.user.cart;
	const cart = await CartController.getCartById(cid);
	if (!hasProduct(cart, pid)) {
		return res.sendProductNotInCart();
	}
	return next();
}

export async function validateProductInCart(req, res, next) {
	// valida que el carrito recibido por parámetro cuente con unidades del producto recibido por parámetro
	const { cid, pid } = req.params;
	const cart = await CartController.getCartById(cid);
	if (!hasProduct(cart, pid)) {
		return res.sendProductNotInCart();
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
