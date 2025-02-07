import { CartController } from '../controllers/cart.controller.js';
import { POLICIES } from '../constants/enums/policies.js';
import { Router } from './Router.js';
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
import {
	validateCid,
	validatePid,
} from '../middleware/validation/validations.mongo.js';

class CartsRouter extends Router {
	constructor() {
		super();
		this.init();
	}

	init() {
		this.param('cid', validateCid, validateCartExists);
		// [validateCartExists] se encarga de buscar el carrito e inyectarlo en [req]
		// carga a la función con una responsabilidad de más, pero molesto a la db una única vez.

		this.param('pid', validatePid);

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

		this.delete('/:cid', [POLICIES.ADMIN], CartController.clearCart);
	}
}

export const cartsRouter = new CartsRouter().router;
