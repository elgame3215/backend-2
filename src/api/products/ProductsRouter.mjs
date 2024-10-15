import { ProductManager } from "./../../managers/Product-Manager.mjs";
import { Router } from "express";

export const router = Router()

router.get('/', async (req, res) => {
	const { limit } = req.query
	let products = await ProductManager.getProducts();
	if (limit) {
		products = products.slice(0, limit)
	}
	res.status(200).send(products);
})

router.get('/:pid', async (req, res) => {
	res.setHeader('Content-Type', 'application/json')
	const { pid } = req.params;

	if (isNaN(pid)) {
		res.status(400).json({ error: 'El ID debe ser numérico' });
		return
	}

	const { product } = await ProductManager.getProductById(pid);
	if (!product) {
		res.status(404).json({ error: 'Producto no encontrado' })
		return
	}

	res.status(200).json(product)
})

router.post('/', async (req, res) => {
	res.setHeader('Content-Type', 'application/json')
	const { ...newProduct } = req.body
	const operation = await ProductManager.addProduct(newProduct)

	if (!operation.succeed) {
		res.status(400).send(JSON.stringify(operation))
		return
	}

	res.status(201).send(JSON.stringify(operation))
})

router.delete('/:pid', async (req, res) => {
	res.setHeader('Content-Type', 'application/json')
	const { pid } = req.params

	if (isNaN(pid)) {
		res.status(400).json({ succeed: false, detail: 'El ID debe ser numérico', statusCode: 400 })
		return
	}

	const operation = await ProductManager.deleteProductById(pid)

	if (!operation.succeed) {
		res.status(operation.statusCode).json(operation)
		return
	}

	res.status(operation.statusCode).json(operation)
})

router.put('/:pid', async (req, res) => {
	res.setHeader('Content-Type', 'application/json')
	const { pid } = req.params

	if (isNaN(pid)) {
		res.status(400).json({ succeed: false, detail: 'El ID debe ser numérico', statusCode: 400 })
		return
	}

	const { ...modifiedValues } = req.body
	const operation = await ProductManager.updateProductById(pid, modifiedValues)
	res.status(operation.statusCode).json(operation)
})