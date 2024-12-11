import { CartController } from "../dao/controllers/cart.controller.js";
import { Router } from "express";
import { validateCid, validatePid } from "../middleware/validateMongoIDs.js";
import { validateCartExists, validateProductInCart, validateQuantity } from "../middleware/validateCart.js";
import { validateBodyPids, validateProductIsAviable } from "../middleware/validateProduct.js";

export const router = Router()

router.post('/', async (req, res) => {
	try {
		const addedCart = await CartController.addCart();
		return res.status(201).json({ status: 'success', addedCart })
	} catch (err) {
		return res.status(500).json({ status: 'error', detail: CartController.errorMessages.serverError })
	}
});

router.get(
	'/:cid',
	validateCid,
	async (req, res) => {
		const { cid } = req.params;
		try {
			const cart = await CartController.getCartById(cid);
			if (!cart) {
				return res.status(404).json({ status: 'error', detail: CartController.errorMessages.cartNotFound })
			}
			return res.status(200).json(cart.products)
		} catch (err) {
			return res.status(500).json({ status: 'error', detail: CartController.errorMessages.serverError })
		}
	})

router.post(
	'/:cid/product/:pid',
	validateCid,
	validatePid,
	validateCartExists,
	validateProductIsAviable,
	async (req, res) => {
		const { cid, pid } = req.params
		try {
			const updatedCart = await CartController.addProductToCart(pid, cid)
			return res.status(200).json({ status: 'success', updatedCart })
		} catch (err) {
			return res.status(500).json({ status: 'error', detail: CartController.errorMessages.serverError })
		}
	})

router.delete(
	'/:cid/product/:pid',
	validateCid,
	validatePid,
	validateCartExists,
	validateProductInCart,
	async (req, res) => {
		const { cid, pid } = req.params
		try {
			const updatedCart = await CartController.deleteProductFromCart(pid, cid)
			return res.status(200).json({ status: 'success', updatedCart })
		} catch (err) {
			return res.status(500).json({ status: 'error', detail: CartController.errorMessages.serverError })
		}
	})

router.put(
	'/:cid',
	validateCid,
	validateCartExists,
	validateBodyPids,
	async (req, res) => {
		const productList = req.body
		const { cid } = req.params
		try {
			const updatedCart = await CartController.updateCartProducts(cid, productList)
			return res.status(200).json({ status: 'success', updatedCart })
		} catch (err) {
			return res.status(500).json({ status: 'error', detail: CartController.errorMessages.serverError })
		}
	})

router.put(
	'/:cid/product/:pid',
	validateCid,
	validatePid,
	validateCartExists,
	validateProductInCart,
	validateQuantity,
	async (req, res) => {
		const { cid, pid } = req.params
		const { quantity } = req.body
		try {
			const updatedCart = await CartController.updateProductQuantity(cid, pid, quantity)
			res.status(200).json({ status: 'success', updatedCart })
		} catch (err) {
			res.status(500).json({ status: 'error', detail: CartController.errorMessages.serverError })
		}
	})

router.delete(
	'/:cid',
	validateCid,
	validateCartExists,
	async (req, res) => {
		const { cid } = req.params
		try {
			const updatedCart = await CartController.clearCart(cid)
			res.status(200).json({ status: 'success', updatedCart })
		} catch (err) {
			res.status(200).json({ status: 'error', detail: CartController.errorMessages.serverError })
		}
	})