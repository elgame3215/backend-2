import { CartsService } from "../db/services/cart.service.js";

export class CartController {
	static async createCart(req, res) {
		try {
			const addedCart = await CartsService.addCart();
			return res.sendResourceCreated({ addedCart });
		} catch (err) {
			console.error(err);
			return res.sendServerError();
		}
	}
	static async getCart(req) {
		return req.cart;	// inyectado por middleware [validateCartExists]
	}
	static async addProduct(req, res) {
		const { pid } = req.params;
		const cid = req.user?.cart;
		if (!cid) {
			res.sendUnauthorized();
		}
		try {
			const updatedCart = await CartsService.addProductToCart(pid, cid);
			return res.sendSuccess({ updatedCart });
		} catch (err) {
			console.error(err);
			return res.sendServerError();
		}
	}
	static async deleteProduct(req, res) {
		const { pid } = req.params;
		const cid = req.user.cart;
		try {
			const updatedCart = await CartsService.deleteProductFromCart(pid, cid);
			return res.sendSuccess({ updatedCart });
		} catch (err) {
			console.error(err);
			return res.sendServerError();
		}
	}
	static async updateCart(req, res) {
		const productList = req.body;
		const { cid } = req.params;
		try {
			const updatedCart = await CartsService.updateCartProducts(
				cid,
				productList
			);
			return res.sendSuccess({ updatedCart });
		} catch (err) {
			console.error(err);
			return res.sendServerError();
		}
	}
	static async updateProductQuantity(req, res) {
		const { cid, pid } = req.params;
		const { quantity } = req.body;
		try {
			const updatedCart = await CartsService.updateProductQuantity(
				cid,
				pid,
				quantity
			);
			return res.sendSuccess({ updatedCart });
		} catch (err) {
			console.error(err);
			res.sendServerError();
		}
	}
	static async clearCart(req, res) {
		const { cid } = req.params;
		try {
			const updatedCart = await CartsService.clearCart(cid);
			return res.sendSuccess({ updatedCart });
		} catch (err) {
			console.error(err);
			res.sendServerError();
		}
	}
}