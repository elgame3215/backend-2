import { POLICIES } from '../config/config.js';
import { ProductController } from '../controllers/product.controller.js';
import { ProductValidator } from '../utils/Product.validator.js';
import { Router } from './Router.js';
import { validateProduct } from '../middleware/product.validations.js';
import { validateQuery } from '../middleware/query.validations.js';
import { validateCamps, validatePid } from '../middleware/generic.validations.js';
class ProductsRouter extends Router {
	constructor() {
		super();
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
			validateCamps(ProductValidator.requiredKeys),
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
			validateCamps(ProductValidator.requiredKeys),
			validateProduct,
			ProductController.updateProduct
		);
	}
}

export const productsRouter = new ProductsRouter().router;
