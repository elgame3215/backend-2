import { formatResponse } from '../utils/query.process.js';
import { POLICIES } from '../config/config.js';
import { ProductController } from '../dao/controllers/product.controller.js';
import { Router } from './router.js';
import { validatePid } from '../middleware/mongoID.validate.js';
import { validateProduct } from '../middleware/product.validate.js';
import { validateQuery } from '../middleware/query.validate.js';

class ProductsRouter extends Router {
	constructor() {
		super();
		this.customResponses = {
			...this.customResponses,
			sendProductNotFound() {
				this.status(404).json({
					status: 'error',
					detail: ProductController.errorMessages.productNotFound,
				});
			},
		};
		this.init();
	}
	async addProduct(req, res) {
		const newProduct = req.body;
		try {
			const addedProduct = await ProductController.addProduct(newProduct);
			req.io.emit('product added', addedProduct);
			return res.sendResourceCreated({ addedProduct });
		} catch (err) {
			console.error(err);
			req.io.emit('invalid product', err.message);
			res.sendServerError();
		}
	}

	async getOneProduct(req, res) {
		const { pid } = req.params;
		try {
			const product = await ProductController.getProductById(pid);
			if (!product) {
				return res.sendProductNotFound();
			}
			res.sendSuccess(product);
		} catch (err) {
			console.error(err);
			res.sendServerError();
		}
	}

	async getAllProducts(req, res) {
		const { limit, sort, query } = req.query;
		const page = req.query.page ?? 1;
		try {
			const response = await ProductController.getProducts(
				limit,
				page,
				sort,
				query
			);
			formatResponse(response, page, limit, sort, query);
			return res.sendSuccess(response);
		} catch (err) {
			console.error(err);
			return res.sendServerError();
		}
	}

	async deleteProduct(req, res) {
		const { pid } = req.params;
		try {
			const deletedProduct = await ProductController.deleteProductById(pid);
			if (!deletedProduct) {
				return res.sendProductNotFound();
			}
			return res.sendSuccess({ deletedProduct });
		} catch (err) {
			console.error(err);
			res.sendServerError();
		}
	}

	async updateProduct(req, res) {
		const { pid } = req.params;
		const modifiedValues = req.body;
		try {
			const updatedProduct = await ProductController.updateProductById(
				pid,
				modifiedValues
			);
			if (!updatedProduct) {
				return res.sendProductNotFound();
			}
			return res.sendSuccess({ updatedProduct });
		} catch (err) {
			console.error(err);
			res.sendServerError();
		}
	}

	init() {
		this.get('/', [POLICIES.public], validateQuery, this.getAllProducts);

		this.get('/:pid', [POLICIES.public], validatePid, this.getOneProduct);

		this.post('/', [POLICIES.admin], validateProduct, this.addProduct);

		this.delete('/:pid', [POLICIES.admin], validatePid, this.deleteProduct);

		this.put(
			'/:pid',
			[POLICIES.admin],
			validatePid,
			validateProduct,
			this.updateProduct
		);
	}
}

export const productsRouter = new ProductsRouter().router;
