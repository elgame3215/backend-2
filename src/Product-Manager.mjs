import fs from "node:fs";

export class ProductManager {
	static #nextId;
	static #path
	static setPath(path) {
		this.#path = path
		if (!fs.existsSync(path)) {
			fs.writeFileSync(path, '[]')
			this.#nextId = 0
		} else {
			const products = JSON.parse(fs.readFileSync(path))
			this.#nextId = Math.max(...products.map(p => p.id)) + 1
		}
	}
	static async getProducts() {
		const productsJSON = await fs.promises.readFile(this.#path);
		const products = JSON.parse(productsJSON);
		return products
	};

	static async addProduct(product) {
		try {
			// Valido que el producto contenga los campos requeridos
			for (const key in product) {
				const value = product[key];
				if (new String(value) == '' && key != 'thumbnail') {
					throw new Error("Todos los campos deben estar completos");
				}
			}
			// Valido que el codigo sea único en la BD
			const { code } = product;
			const products = await this.getProducts()
			if (products.some(p => p.code == code)) {
				throw new Error("Código ya existente");
			};

			// El producto es válido, le asigno un ID y lo registro
			const id = this.#nextId++;
			product.id = id;
			products.push(product)
			await this.updateProducts(products)
			return {
				succeed: true,
				detail: `Product added`,
				addedProduct: product
			}
		} catch (err) {
			return {
				succeed: false,
				detail: `${err}`
			};
		}
	};

	static async getProductById(id) {
		const products = await this.getProducts();
		const product = products.find(p => p.id == id);
		if (!product) {
			return
		}
		return product
	}
	static async deleteProductById(id) {
		try {
			const products = await this.getProducts()
			const index = products.findIndex(p => p.id == id)
			if (index == -1) {
				return { succeed: false, detail: 'Producto no encontrado', statusCode: 404 }
			}
			products.splice(index, 1)
			this.updateProducts(products)
			return { succeed: true, detail: 'Producto eliminado', statusCode: 200 }
		} catch (err) {
			return { succeed: false, detail: err.message, statusCode: 500 }
		}
	}
	static async updateProducts(products) {
		const productsJSON = JSON.stringify(products, null, 2)
		await fs.promises.writeFile(this.#path, productsJSON)
	}
}