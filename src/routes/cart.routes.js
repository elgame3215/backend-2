import { CartController } from '../controllers/cart.controller.js';
import { POLICIES } from '../config/config.js';
import { Router } from './router.js';
import {
	validateBodyPids,
	validateProductIsAviable,
} from '../middleware/product.validate.js';
import {
	validateCartExists,
	validateProductInCart,
	validateProductInUserCart,
	validateQuantity,
	validateUserCartExists,
} from '../middleware/cart.validate.js';
import { validateCid, validatePid } from '../middleware/mongoID.validate.js';

class CartsRouter extends Router {
	constructor() {
		super();
		this.customResponses = {
			sendCartNotFound() {
				return this.status(404).json({
					status: 'error',
					detail: 'Carrito no encontrado',
				});
			},
			sendProductNotInCart() {
				return this.status(404).json({
					status: 'error',
					detail: 'El carrito no tiene unidades del producto',
				});
			},
			...this.customResponses,
		};
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
			CartController.getCart
		);

		this.post(
			'/mycart/product/:pid',
			[POLICIES.user, POLICIES.admin],
			validateUserCartExists,
			validateProductIsAviable,
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
