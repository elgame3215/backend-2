import { CartController } from '../dao/controllers/cart.controller.js';
import passport from 'passport';
import { Router } from 'express';
import {
	validateBodyPids,
	validateProductIsAviable,
} from '../middleware/product.validate.js';
import {
	validateCartExists,
	validateProductInCart,
	validateProductInUserCart,
	validateQuantity,
	validateUserCartExists,
} from '../middleware/cart.validate.js';
import { validateCid, validatePid } from '../middleware/mongoID.validate.js';

export const router = Router();

router.post('/', async (req, res) => {
	try {
		const addedCart = await CartController.addCart();
		return res.status(201).json({ status: 'success', addedCart });
	} catch (err) {
		console.error(err);
		return res.status(500).json({
			status: 'error',
			detail: CartController.errorMessages.serverError,
		});
	}
});

router.get('/:cid', validateCid, async (req, res) => {
	const { cid } = req.params;
	try {
		const cart = await CartController.getCartById(cid);
		if (!cart) {
			return res.status(404).json({
				status: 'error',
				detail: CartController.errorMessages.cartNotFound,
			});
		}
		return res.status(200).json(cart.products);
	} catch (err) {
		console.error(err);
		return res.status(500).json({
			status: 'error',
			detail: CartController.errorMessages.serverError,
		});
	}
});

router.post(
	'/mycart/product/:pid',
	passport.authenticate('jwt', { session: false }),
	validatePid,
	validateUserCartExists,
	validateProductIsAviable,
	async (req, res) => {
		const { pid } = req.params;
		const cid = req.user.cart;
		try {
			const updatedCart = await CartController.addProductToCart(pid, cid);
			return res.status(200).json({ status: 'success', updatedCart });
		} catch (err) {
			console.error(err);
			return res.status(500).json({
				status: 'error',
				detail: CartController.errorMessages.serverError,
			});
		}
	}
);

router.delete(
	'/mycart/product/:pid',
	passport.authenticate('jwt', { session: false }),
	validatePid,
	validateUserCartExists,
	validateProductInUserCart,
	async (req, res) => {
		const { pid } = req.params;
		const cid = req.user.cart;
		try {
			const updatedCart = await CartController.deleteProductFromCart(pid, cid);
			return res.status(200).json({ status: 'success', updatedCart });
		} catch (err) {
			console.error(err);
			return res.status(500).json({
				status: 'error',
				detail: CartController.errorMessages.serverError,
			});
		}
	}
);

router.put(
	'/:cid',
	validateCid,
	validateCartExists,
	validateBodyPids,
	async (req, res) => {
		const productList = req.body;
		const { cid } = req.params;
		try {
			const updatedCart = await CartController.updateCartProducts(
				cid,
				productList
			);
			return res.status(200).json({ status: 'success', updatedCart });
		} catch (err) {
			console.error(err);
			return res.status(500).json({
				status: 'error',
				detail: CartController.errorMessages.serverError,
			});
		}
	}
);

router.put(
	'/:cid/product/:pid',
	validateCid,
	validatePid,
	validateCartExists,
	validateProductInCart,
	validateQuantity,
	async (req, res) => {
		const { cid, pid } = req.params;
		const { quantity } = req.body;
		try {
			const updatedCart = await CartController.updateProductQuantity(
				cid,
				pid,
				quantity
			);
			res.status(200).json({ status: 'success', updatedCart });
		} catch (err) {
			console.error(err);
			res.status(500).json({
				status: 'error',
				detail: CartController.errorMessages.serverError,
			});
		}
	}
);

router.delete('/:cid', validateCid, validateCartExists, async (req, res) => {
	const { cid } = req.params;
	try {
		const updatedCart = await CartController.clearCart(cid);
		res.status(200).json({ status: 'success', updatedCart });
	} catch (err) {
		console.error(err);
		res.status(200).json({
			status: 'error',
			detail: CartController.errorMessages.serverError,
		});
	}
});
