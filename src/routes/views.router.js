import { Router } from "express";
import { ProductController } from "../dao/controllers/product.controller.js";
import { formatResponse } from "../utils/queryProcess.js";
import { validateQuery } from "../middleware/validateQuery.js";
import { CartController } from "../dao/controllers/cart.controller.js";
import { validateCid } from "../middleware/validateMongoIDs.js";
import { validateCartExistsView } from "../middleware/validateCart.js";

export const router = Router()

router.get('/products', validateQuery, async (req, res) => {
	const { limit, page, sort, query } = req.query
	try {
		const response = await ProductController.getProducts(limit, page, sort, query)
		formatResponse(response, limit, page, sort, query)
		res.status(200).render('products', { response })
	} catch (err) {
		console.log(err);
		res.status(500).render('error', { error: 'Error del servidor', code: 500 })
	}
})

router.get('/realtimeproducts', validateQuery, async (req, res) => {
	try {
		const { limit, page, sort, query } = req.query
		const response = await ProductController.getProducts(limit, page, sort, query)
		formatResponse(response, limit, page, sort, query)
		res.status(200).render('realTimeProducts', { response })
	} catch (err) {
		console.log(err);
		res.status(500).render('error', { error: 'Error del servidor', code: 500 })
	}
})

router.get('/products/carts/:cid', validateCid, validateCartExistsView, async (req, res) => {
	const { cid } = req.params
	try {
		const cart = await CartController.getCartById(cid)
		const { products } = cart
		res.status(200).render('cart', { products, cid })
	} catch (err) {
		console.log(err);
		res.status(500).render('error', { error: 'Error del servidor', code: 500 })
	}
})