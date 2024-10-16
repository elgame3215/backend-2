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
		const carts = await this.getCarts();
		const cart = {
			id: this.#nextId++,
			products: []
		}
		carts.push(cart)
		this.updateCarts(carts)
	}

	static async getCartById(cid) {
		const carts = await this.getCarts();
		const cart = carts.find(c => c.id == cid);
		if (!cart) {
			return {
				succeed
			}
		}
		return cart
	}
}

CartsManager.setPath('./carritos.json');

(async () => {
	
	console.log(await CartsManager.getCartById(1))
})()
