import { idParamSchema } from '../dtos/IDs/index.js';
import { POLICIES } from '../constants/enums/policies.js';
import { ProductController } from '../controllers/product.controller.js';
import { productReqSchema } from '../dtos/product/req.product.dto.js';
import { Router } from './Router.js';
import { validateUniqueCode } from '../middleware/validation/validations.product.js';
import { validateBody, validateParams } from 'express-joi-validations';

class ProductsRouter extends Router {
	constructor() {
		super();
		this.init();
	}

	init() {
		this.param('pid', validateParams(idParamSchema));

		this.get('/', [POLICIES.PUBLIC], ProductController.getAllProducts);

		this.get('/:pid', [POLICIES.PUBLIC], ProductController.getOneProduct);

		this.post(
			'/',
			[POLICIES.ADMIN],
			validateUniqueCode,
			validateBody(productReqSchema),
			ProductController.addProduct
		);

		this.delete('/:pid', [POLICIES.ADMIN], ProductController.deleteProduct);

		this.put(
			'/:pid',
			[POLICIES.ADMIN],
			validateBody(productReqSchema),
			ProductController.updateProduct
		);
	}
}

export const productsRouter = new ProductsRouter().router;
