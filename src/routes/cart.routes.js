import { CartController } from '../controllers/cart.controller.js';
import { idParamSchema } from '../dtos/IDs/index.js';
import { POLICIES } from '../constants/enums/policies.js';
import { Router } from './Router.js';
import { validateParams } from 'express-joi-validations';
import {
	validateBodyPids,
	validateProductIsAvailable,
} from '../middleware/validation/validations.product.js';
import {
	validateCartExists,
	validateProductInCart,
	validateProductInUserCart,
	validateQuantity,
	validateUserCartExists,
} from '../middleware/validation/validations.cart.js';

class CartsRouter extends Router {
	constructor() {
		super();
		this.init();
	}

	init() {
		this.param('cid', validateParams(idParamSchema));

		this.param('cid', validateCartExists);

		this.param('pid', validateParams(idParamSchema));

		this.post('/', [POLICIES.USER], CartController.createCart);

		this.get('/:cid', [POLICIES.USER], CartController.getCart);

		this.post(
			'/my-cart/product/:pid',
			[POLICIES.USER],
			validateUserCartExists,
			validateProductIsAvailable,
			CartController.addProduct
		);

		this.delete(
			'/my-cart/product/:pid',
			[POLICIES.USER],
			validateUserCartExists,
			validateProductInUserCart,
			CartController.deleteProduct
		);

		this.put(
			'/:cid',
			[POLICIES.USER],
			validateBodyPids,
			CartController.updateCart
		);

		this.put(
			'/:cid/product/:pid',
			[POLICIES.USER],
			validateProductInCart,
			validateQuantity,
			CartController.updateProductQuantity
		);

		this.delete('/:cid', [POLICIES.USER], CartController.clearCart);
	}
}

export const cartsRouter = new CartsRouter().router;
