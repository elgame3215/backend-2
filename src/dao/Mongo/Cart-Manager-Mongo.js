import { ProductsManager } from "./Product-Manager-Mongo.js";
import { cartModel } from "../models/Cart-Model.js";
import { productModel } from "../models/Product-Model.js"

export class CartsManager {
	static async addCart() {
		let addedCart = { products: [] }
		addedCart = await cartModel.create(addedCart);
		return {
			succeed: true,
			addedCart
		}
	}

	static async getCartById(cid) {
		const cart = await cartModel.findById(cid);
		if (!cart) {
			return {
				succeed: false,
				detail: this.errorMessages.cartNotFound,
			}
		}
		return {
			succeed: true,
			cart
		}
	}

	static async addProductToCart(pid, cid) {
		const cart = await cartModel.findById(cid);
		if (!cart) {
			return {
				succeed: false,
				detail: this.errorMessages.cartNotFound,
			}
		}

		const product = await productModel.findById(pid)
		if (!product) {
			return {
				succeed: false,
				detail: ProductsManager.errorMessages.productNotFound,
			}
		}

		const addedProduct = cart.products.find(p => p._id == pid)
		if (addedProduct) {
			addedProduct.quantity++
		} else {
			cart.products.push({ _id: pid, quantity: 1 })
		}

		const updatedCart = await cartModel.findByIdAndUpdate(cid, cart, { new: true })
		return {
			succeed: true,
			updatedCart
		}
	}
	static errorMessages = {
		cartNotFound: 'Carrito no encontrado',
		serverError: 'Error del servidor',
		nonNumericId: 'El/Los ID deben ser numéricos'
	}
}