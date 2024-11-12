import { CartsManager } from "../dao/Mongo/Cart-Manager-Mongo.js";
import { Router } from "express";
import { validateCid, validatePid } from "../middleware/validateMongoIDs.js";

export const router = Router()

router.post('/', async (req, res) => {
	try {
		const operation = await CartsManager.addCart();
		return res.status(201).json(operation)
	} catch (err) {
		return res.status(500).json(operation)
	}
});

router.get('/:cid', validateCid, async (req, res) => {
	const { cid } = req.params;
	try {
		const operation = await CartsManager.getCartById(cid);
		if (!operation.succeed) {
			return res.status(404).json({ error: CartsManager.errorMessages.cartNotFound })
		}
		return res.status(200).json(operation.cart.products)
	} catch (err) {
		return res.status(500).json({ error: CartsManager.errorMessages.serverError })
	}
})
router.post('/:cid/product/:pid', validateCid, validatePid, async (req, res) => {
	const { cid, pid } = req.params
	try {
		const operation = await CartsManager.addProductToCart(pid, cid)
		if (!operation.succeed) {
			return res.status(404).json(operation)
		}
		return res.status(200).json(operation)
	} catch (err) {
		return res.status(500).json({ error: CartsManager.errorMessages.serverError })
	}
})


