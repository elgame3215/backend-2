import { ProductsManager } from "../dao/Mongo/Product-Manager-Mongo.js";
import { Router } from "express";
import { validatePid } from "../middleware/validateMongoIDs.js";
import { formatResponse } from "../utils/queryProcess.js";
import { validateProduct } from "../middleware/validateProduct.js";
import { validateQuery } from "../middleware/validateQuery.js";


export const router = Router()

let peticiones = 0;
router.get('/', validateQuery, async (req, res) => {
	let response = {};
	let { limit, page, sort, query } = req.query
	page = page ?? 1
	try {
		response = await ProductsManager.getProducts(limit, page, sort, query);
		formatResponse(response, page, limit, sort, query);
		return res.status(200).json(response);
	} catch (err) {
		console.log(err);
		response.status = 'error'
		return res.status(500).json(response);
	}
})

router.get('/:pid', validatePid, async (req, res) => {
	const { pid } = req.params
	try {
		const product = await ProductsManager.getProductById(pid);
		if (!product) {
			return res.status(404).json({ status: 'error', detail: ProductsManager.errorMessages.productNotFound })
		}
		res.status(200).json(product)
	} catch (err) {
		console.log(err);
		res.status(500).json({ detail: ProductsManager.errorMessages.serverError })
	}
})

router.post('/', validateProduct, async (req, res) => {
	const newProduct = req.body
	try {
		let addedProduct = await ProductsManager.addProduct(newProduct)
		req.io.emit('product added', addedProduct)
		return res.status(201).json({ status: 'success', addedProduct })
	} catch (err) {
		console.log(err);
		req.io.emit('invalid product', err.message)
		res.status(500).json({ status: 'error', detail: ProductsManager.errorMessages.serverError })
	}
})

router.delete('/:pid', validatePid, async (req, res) => {
	const { pid } = req.params
	try {
		const deletedProduct = await ProductsManager.deleteProductById(pid)
		if (!deletedProduct) {
			return res.status(404).json({ status: 'error', detail: ProductsManager.errorMessages.productNotFound })
		}
		return res.status(200).json({ status: 'success', deletedProduct })
	} catch (err) {
		console.log(err);
		res.status(500).json({ status: 'error', detail: ProductsManager.errorMessages.serverError })
	}
})

router.put('/:pid', validatePid, validateProduct, async (req, res) => {
	const { pid } = req.params
	const modifiedValues = req.body
	try {
		const updatedProduct = await ProductsManager.updateProductById(pid, modifiedValues)
		if (!updatedProduct) {
			return res.status(404).json({ status: 'error', detail: ProductsManager.errorMessages.productNotFound })
		}
		return res.status(200).json({ status: 'success', updatedProduct })
	} catch (err) {
		console.log(err);
		res.status(500).json({ status: 'error', detail: 'Error del servidor' })
	}
})

