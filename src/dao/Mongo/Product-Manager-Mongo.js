import { productModel } from "../models/Product-Model.js"

export class ProductsManager {
	static async getProducts(limit = 10, page = 1, sort, query) {
		let filter = query ? { category: query } : {};
		let sorter = sort ? { price: sort } : {};
		const products = await productModel.paginate(
			filter,
			{
				page,
				limit,
				lean: true,
				sort: sorter
			}
		);
		return products
	};

	static async addProduct(product) {
		const addedProduct = await productModel.create(product)
		return addedProduct
	};

	static async getProductById(id) {
		const product = await productModel.findById(id);
		return product
	}

	static async deleteProductById(pid) {
		const deletedProduct = await productModel.findByIdAndDelete(pid);
		return deletedProduct
	}

	static async deleteProductByCode(code) {
		await productModel.findOneAndDelete({ code })
	}

	static async updateProductById(pid, modifiedValues) {
		delete modifiedValues._id
		const updatedProduct = await productModel.findByIdAndUpdate(pid, { $set: modifiedValues }, { new: true })
		return updatedProduct
	}

	static errorMessages = {
		productNotFound: 'Producto no encontrado',
		serverError: 'Error del servidor',
	}
}

