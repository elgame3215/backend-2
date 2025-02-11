import { productModel } from '../models/product.model.js';

export class ProductService {
	static async getProducts(limit = 10, page = 1, sort, query) {
		const regExp = new RegExp(`\\b${query}\\b`, 'i');
		const filter = query ? { category: { $regex: regExp } } : {};
		const sorter = sort ? { price: sort } : {};
		const products = await productModel.paginate(filter, {
			page,
			limit,
			sort: sorter,
			lean: true,
		});
		return products;
	}

	static async addProduct(product) {
		const addedProduct = await productModel.create(product);
		return addedProduct.toObject();
	}

	static async getProductById(pid) {
		const product = await productModel.findById(pid).lean({ virtuals: true });
		return product;
	}

	static async getProductByCode(code) {
		const product = await productModel
			.findOne({ code })
			.lean({ virtuals: true });
		return product;
	}

	static async deleteProductById(pid) {
		const deletedProduct = await productModel
			.findByIdAndDelete(pid)
			.lean({ virtuals: true });
		return deletedProduct;
	}

	static async updateProductById(pid, modifiedValues) {
		delete modifiedValues._id;
		const updatedProduct = await productModel
			.findByIdAndUpdate(pid, { $set: modifiedValues }, { new: true })
			.lean({ virtuals: true });
		return updatedProduct;
	}

	static async reduceAmounts(products) {
		const query = products.map(p => {
			return {
				updateOne: {
					filter: { _id: p.product._id },
					update: { $inc: { stock: -p.quantity } },
				},
			};
		});

		const response = await productModel.bulkWrite(query);
		return response;
	}
}
