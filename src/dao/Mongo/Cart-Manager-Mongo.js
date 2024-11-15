import { cartModel } from "../models/Cart-Model.js";

export class CartsManager {
	static async addCart() {
		let addedCart = { products: [] }
		addedCart = await cartModel.create(addedCart);
		return addedCart
	}

	static async getCartById(cid) {
		const cart = await cartModel.findById(cid).populate('products.product');
		return cart
	}

	static async addProductToCart(pid, cid) {
		const cart = await cartModel.findById(cid);
		const addedProduct = cart.products.find(p => p._id == pid)
		if (addedProduct) {
			addedProduct.quantity++
		} else {
			cart.products.push({ _id: pid, quantity: 1 })
		}

		const updatedCart = await cartModel.findByIdAndUpdate(cid, cart, { new: true })
		return updatedCart
	}

	static async deleteProductFromCart(pid, cid) {
		const updatedCart = await cartModel.findByIdAndUpdate(cid,
			{
				$pull: { products: { _id: pid } }
			},
			{
				new: true
			}
		)
		return updatedCart
	}

	static async updateCartProducts(cid, productList) {
		const updatedCart = await cartModel.findByIdAndUpdate(cid,
			{ products: productList },
			{ new: true }
		)
		return updatedCart
	}

	static errorMessages = {
		cartNotFound: 'Carrito no encontrado',
		serverError: 'Error del servidor',
		nonNumericId: 'El/Los ID deben ser numéricos'
	}
}