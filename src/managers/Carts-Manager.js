import fs from "fs";
import { ProductsManager } from "./Product-Manager.js";

export class CartsManager {
	static #path;
	static #nextId;

	static setPath(path) {
		this.#path = path
		if (!fs.existsSync(path)) {
			fs.writeFileSync(path, '[]')
			this.#nextId = 0
		} else {
			const carts = JSON.parse(fs.readFileSync(path));
			const nextId =
				0 < carts.length ?
					(Math.max(...carts.map(p => p.id)) + 1) :
					0
			this.#nextId = nextId ?? 0;
		}
	}

	static async getCarts() {
		const cartsJSON = await fs.promises.readFile(this.#path)
		const carts = JSON.parse(cartsJSON)
		return carts
	}

	static updateCarts(carts) {
		const cartsJSON = JSON.stringify(carts, null, 2)
		fs.writeFileSync(this.#path, cartsJSON)
	}

	static async addCart() {
		try {
			const carts = await this.getCarts();
			const newCart = {
				id: this.#nextId++,
				products: []
			}
			carts.push(newCart)
			this.updateCarts(carts)
			return {
				succeed: true,
				statusCode: 201,
				addedCart: newCart
			}
		} catch (err) {
			return {
				succeed: false,
				detail: 'Error del servidor',
				statusCode: 500,
			}
		}
	}

	static async getCartById(cid) {
		try {
			const carts = await this.getCarts();
			const cart = carts.find(c => c.id == cid);
			if (!cart) {
				return {
					succeed: false,
					detail: this.errorMessages.cartNotFound,
					statusCode: 404
				}
			}
			return {
				succeed: true,
				statusCode: 200,
				cart
			}
		} catch (err) {
			return {
				succeed: false,
				detail: this.errorMessages.serverError,
				statusCode: 500
			}
		}
	}

	static async addProductToCart(pid, cid) {
		const carts = await this.getCarts();
		const cart = carts.find(c => c.id == cid);
		const products = await ProductsManager.getProducts()

		if (!products.some(p => p.id == pid)) {
			return {
				succeed: false,
				detail: ProductsManager.errorMessages.productNotFound,
				statusCode: 404
			}
		}

		if (!cart) {
			return {
				succeed: false,
				detail: this.errorMessages.cartNotFound,
				statusCode: 404
			}
		}
		const product = cart.products.find(p => p.id == pid)
		if (!product) {
			cart.products.push({
				id: pid,
				quantity: 1
			})
		} else {
			product.quantity++
		}
		await this.updateCarts(carts)
		return {
			succeed: true,
			statusCode: 200,
			cart
		}
	}
	static errorMessages = {
		cartNotFound: 'Carrito no encontrado',
		serverError: 'Error del servidor',
		nonNumericId: 'El/Los ID deben ser numéricos'
	}
}