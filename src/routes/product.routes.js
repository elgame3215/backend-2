import { POLICIES } from '../config/config.js';
import { ProductController } from '../controllers/product.controller.js';
import { ProductService } from '../db/services/product.service.js';
import { Router } from './router.js';
import { validatePid } from '../middleware/mongoID.validate.js';
import { validateProduct } from '../middleware/product.validate.js';
import { validateQuery } from '../middleware/query.validate.js';
class ProductsRouter extends Router {
	constructor() {
		super();
		this.customResponses = {
			sendProductNotFound() {
				this.status(404).json({
					status: 'error',
					detail: ProductService.errorMessages.productNotFound,
				});
			},
			...this.customResponses,
		};
		this.init();
	}

	init() {
		this.get(
			'/',
			[POLICIES.public],
			validateQuery,
			ProductController.getAllProducts
		);

		this.get(
			'/:pid',
			[POLICIES.public],
			validatePid,
			ProductController.getOneProduct
		);

		this.post(
			'/',
			[POLICIES.admin],
			validateProduct,
			ProductController.addProduct
		);

		this.delete(
			'/:pid',
			[POLICIES.admin],
			validatePid,
			ProductController.deleteProduct
		);

		this.put(
			'/:pid',
			[POLICIES.admin],
			validatePid,
			validateProduct,
			ProductController.updateProduct
		);
	}
}

export const productsRouter = new ProductsRouter().router;
