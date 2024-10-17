import fs from "fs";

export class CartsManager {
	static #path;
	static #nextId;
	static setPath(path) {
		this.#path = path
		if (!fs.existsSync(path)) {
			fs.writeFileSync(path, '[]')
		} else {
			const carts = JSON.parse(fs.readFileSync(path));
			const nextId =
				carts.length > 0 ?
					Math.max(...carts.map(p => p.id)) + 1 :
					0;
			this.#nextId = nextId ? nextId : 0;
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
	static errorMessages = {
		cartNotFound: 'Carrito no encontrado',
		serverError: 'Error del servidor',
		nonNumericId: 'El ID debe ser numérico'
	}
}