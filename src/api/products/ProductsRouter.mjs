import { ProductManager } from "./../../Product-Manager.mjs";
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
	const { pid } = req.params;
	if (isNaN(pid)) {
		res.status(400).send('El ID debe ser numérico');
	}
	const product = await ProductManager.getProductById(pid);
	if (!product) {
		res.status(404).send({ error: 'Producto no encontrado' })
	}
	res.status(200).send(product)
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

router.delete('/:id', async (req, res) => {
	res.setHeader('Content-Type', 'application/json')
	const { id } = req.params
	const operation = await ProductManager.deleteProductById(id)
	if (!operation.succeed) {
		res.status(operation.statusCode).json(operation)
		return
	}
	res.status(operation.statusCode).json(operation)
})