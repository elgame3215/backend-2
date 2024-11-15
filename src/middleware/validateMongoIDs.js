import { isValidObjectId } from "mongoose";
import { CartsManager } from "../dao/Mongo/Cart-Manager-Mongo.js";
import { ProductsManager } from "../dao/Mongo/Product-Manager-Mongo.js";

export function validateCid(req, res, next) {
	const { cid } = req.params;
	if (!isValidObjectId(cid)) {
		return res.status(400).json({ status: 'error', detail: 'invalid cid' });
	}
	next();
}
export function validatePid(req, res, next) {
	const { pid } = req.params;
	if (!isValidObjectId(pid)) {
		return res.status(400).json({ status: 'error', detail: 'invalid pid' });
	}
	next();
}

export async function validateCartExists(req, res, next) {
	const { cid } = req.params;
	const cart = await CartsManager.getCartById(cid)
	if (!cart) {
		return res.status(404).json({ status: 'error', detail: CartsManager.errorMessages.cartNotFound });
	}
	next();
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
		if (!(Object.hasOwn(p, '_id') && Object.hasOwn(p, 'quantity'))) {
			return res.status(400).json({ status: 'error', detail: 'invalid format', invalidProduct: p })
		}
		if (!isValidObjectId(p._id)) {
			return res.status(400).json({
				status: 'error', detail: `invalid pid: ${p._id}`
			})
		}
		if (isNaN(p.quantity)) {
			return res.status(400).json({
				status: 'error', detail: `product: ${p._id} quantity must be a number`
			})
		}
		if (p.quantity < 1) {
			return res.status(400).json({
				status: 'error', detail: `product: ${p._id} quantity must be at least 1`
			})
		}
		const product = await ProductsManager.getProductById(p._id)
		if (!product) {
			return res.status(404).json({
				status: 'error', detail: ProductsManager.errorMessages.productNotFound,
				idNotFound: p._id
			})
		}
	};
	next()
}