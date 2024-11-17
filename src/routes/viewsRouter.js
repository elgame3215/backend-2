import { Router } from "express";
import { ProductsManager } from "../dao/Mongo/Product-Manager-Mongo.js";
import { formatResponse } from "../utils/queryProcess.js";

export const router = Router()

router.get('/', async (req, res) => {
	let { limit, page, sort, query } = req.query
	const response = await ProductsManager.getProducts(limit, page, sort, query)
	formatResponse(response)
	res.status(200).render('index', { response })
})

router.get('/realtimeproducts', async (req, res) => {
	try {
		let { limit, page, sort, query } = req.query
		const response = await ProductsManager.getProducts(limit, page, sort, query)
		formatResponse(response)
		res.status(200).render('realTimeProducts', { response })
	} catch (error) {
		res.status(500).render('error', {})
	}
})