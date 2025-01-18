import { CartController } from '../controllers/cart.controller.js';
import { POLICIES } from '../config/config.js';
import { Router } from './Router.js';
import {
	validateBodyPids,
	validateProductIsAvailable,
} from '../middleware/product.validations.js';
import {
	validateCartExists,
	validateProductInCart,
	validateProductInUserCart,
	validateQuantity,
	validateUserCartExists,
} from '../middleware/cart.validations.js';
import { validateCid, validatePid } from '../middleware/generic.validations.js';

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

		this.post('/', [POLICIES.admin], CartController.createCart);

		this.get(
			'/:cid',
			[POLICIES.user, POLICIES.admin],
			validateCid,
			validateCartExists,
			CartController.getCart
		);

		this.post(
			'/mycart/product/:pid',
			[POLICIES.user, POLICIES.admin],
			validateUserCartExists,
			validateProductIsAvailable,
			CartController.addProduct
		);

		this.delete(
			'/mycart/product/:pid',
			[POLICIES.user, POLICIES.admin],
			validateUserCartExists,
			validateProductInUserCart,
			CartController.deleteProduct
		);

		this.put(
			'/:cid',
			[POLICIES.user, POLICIES.admin],
			validateBodyPids,
			CartController.updateCart
		);

		this.put(
			'/:cid/product/:pid',
			[POLICIES.user, POLICIES.admin],
			validateProductInCart,
			validateQuantity,
			CartController.updateProductQuantity
		);

		this.delete(
			'/:cid',
			[POLICIES.user, POLICIES.admin],
			CartController.clearCart
		);
	}
}

export const cartsRouter = new CartsRouter().router;
