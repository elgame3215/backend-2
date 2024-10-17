import { ProductsManager } from "./../../managers/Product-Manager.mjs";
import { Router } from "express";

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
		return res.status(500).json({ error: 'Error del servidor' });
	}
})

router.get('/:pid', async (req, res) => {
	const { pid } = req.params;

	if (isNaN(pid)) {
		res.status(400).json({ error: 'El ID debe ser numérico' });
		return
	}

	try {
		const { product } = await ProductsManager.getProductById(pid);
		if (!product) {
			res.status(404).json({ error: 'Producto no encontrado' })
			return
		}
		res.status(200).json(product)
	} catch (err) {
		res.status(500).json({ error: 'Error del servidor' })
	}
})

router.post('/', async (req, res) => {
	const { ...newProduct } = req.body
	try {
		let operation = await ProductsManager.addProduct(newProduct)
		return res.status(operation.statusCode).json(operation)
	} catch (err) {
		const { statusCode, detail } = operation
		res.status(statusCode).json({ error: detail })
	}
})

router.delete('/:pid', async (req, res) => {
	const { pid } = req.params
	if (isNaN(pid)) {
		return res.status(400).json({ succeed: false, detail: 'El ID debe ser numérico', statusCode: 400 })
	}
	try {
		const operation = await ProductsManager.deleteProductById(pid)
		if (!operation.succeed) {
			return res.status(operation.statusCode).json(operation)
		}
		return res.status(operation.statusCode).json(operation)
	} catch (err) {
		res.status(500).json({ error: 'Error del servidor' })
	}
})

router.put('/:pid', async (req, res) => {
	const { pid } = req.params
	if (isNaN(pid)) {
		return res.status(400).json({ succeed: false, detail: 'El ID debe ser numérico', statusCode: 400 })
	}
	const { ...modifiedValues } = req.body
	delete modifiedValues.id
	try {
		const operation = await ProductsManager.updateProductById(pid, modifiedValues)
		return res.status(operation.statusCode).json(operation)
	} catch (err) {
		res.status(500).json({ error: 'Error del servidor' })
	}
})