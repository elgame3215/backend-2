import { CartController } from "../dao/controllers/cart.controller.js";
import { isValidObjectId } from "mongoose";
import { ProductController } from "../dao/controllers/product.controller.js";
import { ProductValidator } from "../utils/product.validator.js";

export async function validateProduct(req, res, next) {
	const product = req.body
	try {
		ProductValidator.validateKeys(product);
		ProductValidator.validateValues(product);
		await ProductValidator.validateCode(product);
		return next();
	} catch (err) {
		req.io.emit('invalid product', err.message)
		return res.status(400).json({ status: 'error', detail: err.message })
	}
}

export async function validateProductIsAviable(req, res, next) {
	const { cid, pid } = req.params;
	const product = await ProductController.getProductById(pid);
	if (!product) {
		return res.status(404).json({ status: 'error', detail: ProductController.errorMessages.productNotFound });
	}
	if (product.stock == 0) {
		return res.status(400).json({ status: 'error', detail: ProductController.errorMessages.productOutOfStock });
	}
	const cart = await CartController.getCartById(cid)
	const productInCart = cart.products.find(p => p.product._id == pid);
	if (!productInCart) {
		return next();
	}
	if (product.stock <= productInCart.quantity) {
		return res.status(400).json({ status: 'error', detail: ProductController.errorMessages.productOutOfStock });
	}
	return next();
}

export async function validateBodyPids(req, res, next) {
	const productList = req.body
	if (!Array.isArray(productList)) {
		return res.status(400).json({ status: 'error', detail: 'array expected' })
	}
	for (const p of productList) {
		if (!(Object.hasOwn(p, 'product') && Object.hasOwn(p, 'quantity'))) {
			return res.status(400).json({ status: 'error', detail: 'invalid format', invalidProduct: p })
		}
		if (!isValidObjectId(p.product)) {
			return res.status(400).json({
				status: 'error', detail: `invalid pid: ${p.product}`
			})
		}
		if (isNaN(p.quantity)) {
			return res.status(400).json({
				status: 'error', detail: `product: ${p.product} quantity must be a number`
			})
		}
		if (p.quantity < 1) {
			return res.status(400).json({
				status: 'error', detail: `product: ${p.product} quantity must be at least 1`
			})
		}
		const product = await ProductController.getProductById(p.product)
		if (!product) {
			return res.status(404).json({
				status: 'error',
				detail: ProductController.errorMessages.productNotFound,
				idNotFound: p.product
			})
		}
		if (product.stock < p.quantity) {
			return res.status(404).json({
				status: 'error',
				detail: ProductController.errorMessages.productOutOfStock,
				idOutOfStock: p.product
			})
		};
	}
	return next()
}