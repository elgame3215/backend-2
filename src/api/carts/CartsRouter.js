import { CartsManager } from "../../managers/Carts-Manager.js";
import { Router } from "express";
import { ProductValidator } from "../../utils/Product-Validator.js";
import { ProductsManager } from "../../managers/Product-Manager.js";

export const router = Router()

router.post('/', async (req, res) => {
	const operation = await CartsManager.addCart();
	return res.status(operation.statusCode).json(operation)
});

router.get('/:cid', async (req, res) => {
	const { cid } = req.params;

	if (isNaN(cid)) {
		return res.status(400).json({ detail: ProductsManager.errorMessages.nonNumericId })
	}
	const operation = await CartsManager.getCartById(cid);
	const { succeed, cart, statusCode } = operation;
	if (!succeed) {
		return res.status(statusCode).json(operation)
	}
	return res.status(statusCode).json(cart.products)
})

router.post('/:cid/product/:pid', async (req, res) => {
	const { cid, pid } = req.params
	if (isNaN(cid) || isNaN(pid)) {
		return res.status(400).json({detail: CartsManager.errorMessages.nonNumericId})
	}
	const operation = await CartsManager.addProductToCart(Number(pid), Number(cid))
	res.status(operation.statusCode).json(operation)
})