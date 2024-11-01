import { Router } from "express";
import { ProductsManager } from "../managers/Product-Manager.js";

export const router = Router()

router.get('/', async (req, res) => {
	try {
		const products = await ProductsManager.getProducts()
		res.status(200).render('index', { products })
	} catch (error) {
		res.status(500).status('Error del servidor')
	}
})

router.get('/realtimeproducts', async (req, res) => {
	try {
		const products = await ProductsManager.getProducts();
		res.status(200).render('realTimeProducts', { products })
	} catch (error) {
		res.status(500).status('Error del servidor')
	}
})