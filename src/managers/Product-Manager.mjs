import fs from "node:fs";
import { ProductValidator } from "./../utils/Product-Validator.mjs";

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
			const nextId = Math.max(...products.map(p => p.id)) + 1;
			this.#nextId = nextId
		}
	}
	static async getProducts() {
		const productsJSON = await fs.promises.readFile(this.#path);
		const products = JSON.parse(productsJSON);
		return products
	};

	static async addProduct(product) {
		try {
			const products = await this.getProducts()
			ProductValidator.validateKeys(product);
			ProductValidator.validateValues(product);
			ProductValidator.validateID(product, products);

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
			return { succeed: false, detail: 'Producto no encontrado', statusCode: 404 }
		}
		return { succeed: true, statusCode: 200, product }
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
	static async updateProductById(pid, modifiedValues) {
		try {
			ProductValidator.validateValues(modifiedValues)
		} catch (err) {
			return { succeed: false, detail: err.message, statusCode: 400 }
		}
		try {
			const products = await ProductManager.getProducts()
			const { product } = await ProductManager.getProductById(pid)
			console.log(product);
			if (!product) {
				return { succeed: false, detail: 'Producto no encontrado', statusCode: 404 }
			}
			const index = products.findIndex(p => p.id == pid)
			products[index] = { ...product, ...modifiedValues }
			ProductManager.updateProducts(products)
			return { succeed: true, detail: 'Product updated', statusCode: 200, updatedProduct: products[index] }
		} catch (err) {
			return { succeed: false, detail: err.message, statusCode: 500 }
		}
	}
	static async updateProducts(products) {
		const productsJSON = JSON.stringify(products, null, 2)
		await fs.promises.writeFile(this.#path, productsJSON)
	}
}