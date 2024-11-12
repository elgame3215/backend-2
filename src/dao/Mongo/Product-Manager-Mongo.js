import { ProductValidator } from "../../utils/Product-Validator.js";
import { productModel } from "../models/Product-Model.js"

export class ProductsManager {
	static async getProducts() {
		const products = await productModel.find();
		return products
	};

	static async addProduct(product) {
		try {
			ProductValidator.validateKeys(product);
			ProductValidator.validateValues(product);
			await ProductValidator.validateCode(product);
		} catch (err) {
			return {
				succeed: false,
				detail: err.message,
			}
		}
		const addedProduct = await productModel.create(product)
		return {
			succeed: true,
			detail: `Product added`,
			addedProduct
		}
	};

	static async getProductById(id) {
		const product = await productModel.findById(id);
		if (!product) {
			return {
				succeed: false,
				detail: this.errorMessages.productNotFound,
			}
		}
		return {
			succeed: true,
			product
		}
	}

	static async deleteProductById(pid) {
		const deletedProduct = await productModel.findByIdAndDelete(pid);
		if (!deletedProduct) {
			return {
				succeed: false,
				detail: this.errorMessages.productNotFound,
			}
		}
		return {
			succeed: true,
			deletedProduct
		}
	}

	static async deleteProductByCode(code) {
		await productModel.findOneAndDelete({ code })
	}

	static async updateProductById(pid, modifiedValues) {
		delete modifiedValues._id
		try {
			ProductValidator.validateValues(modifiedValues)
		} catch (err) {
			return {
				succeed: false,
				hasFoundProduct: true,
				detail: err.message,
			}
		}
		const updatedProduct = await productModel.findByIdAndUpdate(pid, { $set: modifiedValues }, { new: true })
		if (!updatedProduct) {
			return {
				succeed: false,
				hasFoundProduct : false,
				detail: this.errorMessages.productNotFound,
			}
		}
		return {
			succeed: true,
			hasFoundProduct : true,
			updatedProduct
		}
	}

	static errorMessages = {
		productNotFound: 'Producto no encontrado',
		serverError: 'Error del servidor',
	}
}

