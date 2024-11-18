import { CartsManager } from "../dao/Mongo/Cart-Manager-Mongo.js";
import { ProductsManager } from "../dao/Mongo/Product-Manager-Mongo.js";

export async function validateCartExists(req, res, next) {
	const { cid } = req.params;
	const cart = await CartsManager.getCartById(cid)
	if (!cart) {
		return res.status(404).json({ status: 'error', detail: CartsManager.errorMessages.cartNotFound });
	}
	next();
}

export async function validateCartExistsView(req, res, next) {
	const { cid } = req.params;
	const cart = await CartsManager.getCartById(cid)
	if (!cart) {
		return res.status(404).render('error', { error: CartsManager.errorMessages.cartNotFound, code: 404 });
	}
	next();
}

export async function validateProductInCart(req, res, next) {
	const { cid, pid } = req.params
	const cart = await CartsManager.getCartById(cid)
	if (!cart.products.find(p => p.product._id == pid)) {
		return res.status(404).json({ status: 'error', detail: ProductsManager.errorMessages.productNotFound })
	}
	next()
}

export async function validateQuantity(req, res, next) {
	const { quantity } = req.body
	if (!quantity) {
		return res.status(400).json({ status: 'error', detail: 'quantity required' })
	}
	if (isNaN(quantity)) {
		return res.status(400).json({ status: 'error', detail: 'quantity must be a number' })
	}
	const { pid } = req.params
	const product = await ProductsManager.getProductById(pid)
	if (product.stock < quantity) {
		return res.status(400).json({ status: 'error', detail: ProductsManager.errorMessages.productOutOfStock })
	}
	next()
}