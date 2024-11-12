import { Router } from "express";
import { ProductsManager } from "../dao/Mongo/Product-Manager-Mongo.js";

export const router = Router()

router.get('/', async (req, res) => {
	try {
		const products = (await ProductsManager.getProducts()).map(p => p.toObject()); // transformados a objeto para que handlebars pueda procesarlos
		res.status(200).render('index', { products })
	} catch (error) {
		res.status(500).status('Error del servidor')
	}
})

router.get('/realtimeproducts', async (req, res) => {
	try {
		const products = (await ProductsManager.getProducts()).map(p => p.toObject()); // transformados a objeto para que handlebars pueda procesarlos
		res.status(200).render('realTimeProducts', { products })
	} catch (error) {
		res.status(500).status('Error del servidor')
	}
})