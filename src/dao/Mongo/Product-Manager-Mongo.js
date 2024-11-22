import { productModel } from "../models/Product-Model.js"

export class ProductsManager {
	static async getProducts(limit = 10, page = 1, sort, query) {
		const regExp = new RegExp(`\\b${query}\\b`, 'i')
		let filter = query ? { category: { $regex: regExp } } : {};
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
		console.log(products);
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

	static async updateProductById(pid, modifiedValues) {
		delete modifiedValues._id
		const updatedProduct = await productModel.findByIdAndUpdate(pid, { $set: modifiedValues }, { new: true })
		return updatedProduct
	}

	static errorMessages = {
		productNotFound: 'Producto no encontrado',
		serverError: 'Error del servidor',
		productOutOfStock: 'Producto sin stock suficiente'
	}
}

