import { isValidObjectId } from "mongoose";
import { ProductsManager } from "../dao/Mongo/Product-Manager-Mongo.js";
import { ProductValidator } from "../utils/Product-Validator.js";

export async function validateProduct(req, res, next) {
	const product = req.body
	try {
		ProductValidator.validateKeys(product);
		ProductValidator.validateValues(product);
		await ProductValidator.validateCode(product);
		next();
	} catch (err) {
		return res.status(400).json({status: 'error', detail: err.message})
	}
}

export async function validateProductExists(req, res, next) {
	const { pid } = req.params;
	const product = await ProductsManager.getProductById(pid);
	if (!product) {
		return res.status(404).json({ status: 'error', detail: ProductsManager.errorMessages.productNotFound });
	}
	next();
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
		const product = await ProductsManager.getProductById(p.product)
		if (!product) {
			return res.status(404).json({
				status: 'error', detail: ProductsManager.errorMessages.productNotFound,
				idNotFound: p.product
			})
		}
	};
	next()
}