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