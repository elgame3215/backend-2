import fs from "node:fs";
import { ProductValidator } from "../utils/Product-Validator.js";

export class ProductsManager {
	static #nextId;
	static #path;

	static setPath(path) {
		this.#path = path
		if (!fs.existsSync(path)) {
			fs.writeFileSync(path, '[]')
		} else {
			const products = JSON.parse(fs.readFileSync(path))
			const nextId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 0;
			this.#nextId = nextId
		}
	}

	static async getProducts() {
		const productsJSON = await fs.promises.readFile(this.#path);
		const products = JSON.parse(productsJSON);
		return products
	};

	static async addProduct(product) {
		let products;
		try {
			products = await this.getProducts()
			ProductValidator.validateKeys(product);
			ProductValidator.validateValues(product);
			ProductValidator.validateCode(product, products);
		} catch (err) {
			return {
				succeed: false,
				detail: err.message,
				statusCode: 400
			}
		}
		try {
			const id = this.#nextId++;
			product.id = id;
			products.push(product)
			await this.updateProducts(products)
			return {
				succeed: true,
				detail: `Product added`,
				statusCode: 201,
				addedProduct: product
			}
		} catch (err) {
			return {
				succeed: false,
				detail: this.errorMessages.serverError,
				statusCode: 500
			};
		}
	};

	static async getProductById(id) {
		const products = await this.getProducts();
		const product = products.find(p => p.id == id);
		if (!product) {
			return { succeed: false, detail: this.errorMessages.productNotFound, statusCode: 404 }
		}
		return { succeed: true, statusCode: 200, product }
	}

	static async deleteProductById(pid) {
		try {
			const products = await this.getProducts()
			const index = products.findIndex(p => p.id == pid)
			if (index == -1) {
				return { succeed: false, detail: this.errorMessages.productNotFound, statusCode: 404 }
			}
			products.splice(index, 1)
			this.updateProducts(products)
			return { succeed: true, detail: `Eliminado producto id: ${pid}`, statusCode: 200 }
		} catch (err) {
			return { succeed: false, detail: this.errorMessages.serverError, statusCode: 500 }
		}
	}

	static async updateProductById(pid, modifiedValues) {
		try {
			ProductValidator.validateValues(modifiedValues)
		} catch (err) {
			return { succeed: false, detail: err.message, statusCode: 400 }
		}
		try {
			const products = await ProductsManager.getProducts()
			const { product } = await ProductsManager.getProductById(pid)
			if (!product) {
				return { succeed: false, detail: this.errorMessages.productNotFound, statusCode: 404 }
			}
			const index = products.findIndex(p => p.id == pid)
			products[index] = { ...product, ...modifiedValues }
			ProductsManager.updateProducts(products)
			return { succeed: true, detail: 'Product updated', statusCode: 200, updatedProduct: products[index] }
		} catch (err) {
			return { succeed: false, detail: err.message, statusCode: 500 }
		}
	}

	static async updateProducts(products) {
		const productsJSON = JSON.stringify(products, null, 2)
		await fs.writeFileSync(this.#path, productsJSON)
	}

	static errorMessages = {
		productNotFound: 'Producto no encontrado',
		serverError: 'Error del servidor',
		nonNumericId: 'El ID debe ser numérico'
	}
}