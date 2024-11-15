import { CartsManager } from "../dao/Mongo/Cart-Manager-Mongo.js";
import { Router } from "express";
import { validateBodyPids, validateCartExists, validateCid, validatePid, validateProductExists } from "../middleware/validateMongoIDs.js";

export const router = Router()

router.post('/', async (req, res) => {
	try {
		const addedCart = await CartsManager.addCart();
		return res.status(201).json({ status: 'success', addedCart })
	} catch (err) {
		return res.status(500).json({ status: 'error', detail: CartsManager.errorMessages.serverError })
	}
});

router.get('/:cid', validateCid, async (req, res) => {
	const { cid } = req.params;
	try {
		const cart = await CartsManager.getCartById(cid);
		if (!cart) {
			return res.status(404).json({ status: 'error', detail: CartsManager.errorMessages.cartNotFound })
		}
		return res.status(200).json(cart.products)
	} catch (err) {
		return res.status(500).json({ status: 'error', detail: CartsManager.errorMessages.serverError })
	}
})
router.post('/:cid/product/:pid', validateCid, validatePid, validateCartExists, validateProductExists, async (req, res) => {
	const { cid, pid } = req.params
	try {
		const updatedCart = await CartsManager.addProductToCart(pid, cid)
		return res.status(200).json({ status: 'success', updatedCart })
	} catch (err) {
		return res.status(500).json({ status: 'error', detail: CartsManager.errorMessages.serverError })
	}
})

router.delete('/:cid/product/:pid', validateCid, validatePid, validateCartExists, async (req, res) => {
	const { cid, pid } = req.params
	try {
		const updatedCart = await CartsManager.deleteProductFromCart(pid, cid)
		return res.status(200).json({ status: 'success', updatedCart })
	} catch (err) {
		return res.status(500).json({ status: 'error', detail: CartsManager.errorMessages.serverError })
	}
})

router.put('/:cid', validateCid, validateCartExists, validateBodyPids, async (req, res) => {
	const productList = req.body
	const { cid } = req.params
	try {
		const updatedCart = await CartsManager.updateCartProducts(cid, productList)
		return res.status(200).json({ status: 'success', updatedCart })
	} catch (err) {
		return res.status(500).json({ status: 'error', detail: CartsManager.errorMessages.serverError })
	}
})