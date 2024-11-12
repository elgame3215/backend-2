import { ProductsManager } from "../dao/Mongo/Product-Manager-Mongo.js";
import { Router } from "express";
import { validatePid } from "../middleware/validateMongoIDs.js";


export const router = Router()


router.get('/', async (req, res) => {
	try {
		let products = await ProductsManager.getProducts();
		const { limit } = req.query
		if (limit) {
			products = products.slice(0, limit)
		}
		return res.status(200).json(products);
	} catch (err) {
		return res.status(500).json(err.message);
	}
})

router.get('/:pid', validatePid, async (req, res) => {
	const { pid } = req.params
	try {
		const { product } = await ProductsManager.getProductById(pid);
		if (!product) {
			return res.status(404).json({ error: ProductsManager.errorMessages.productNotFound })
		}
		res.status(200).json(product)
	} catch (err) {
		res.status(500).json({ detail: ProductsManager.errorMessages.serverError })
	}
})

router.post('/', async (req, res) => {
	const { ...newProduct } = req.body
	try {
		let operation = await ProductsManager.addProduct(newProduct)
		if (!operation.succeed) {
			return res.status(400).json(operation)
		}
		return res.status(201).json(operation)
	} catch (err) {
		res.status(500).json({ error: ProductsManager.errorMessages.serverError })
	}
})

router.delete('/:pid', validatePid, async (req, res) => {
	const { pid } = req.params
	try {
		const operation = await ProductsManager.deleteProductById(pid)
		if (!operation.succeed) {
			return res.status(404).json(operation)
		}
		return res.status(200).json(operation)
	} catch (err) {

		res.status(500).json({ error: ProductsManager.errorMessages.serverError })
	}
})

router.put('/:pid', validatePid, async (req, res) => {
	const { pid } = req.params
	const { ...modifiedValues } = req.body
	try {
		const operation = await ProductsManager.updateProductById(pid, modifiedValues)
		if (!operation.succeed && operation.hasFoundProduct) {
			return res.status(400).json(operation)
		}
		if (!operation.succeed && !operation.hasFoundProduct) {
			return res.status(404).json(operation)
		}
		return res.status(200).json(operation)
	} catch (err) {
		res.status(500).json({ error: 'Error del servidor' })
	}
})