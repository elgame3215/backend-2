import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
	{
		title: String,
		description: String,
		code: {
			type: String,
			unique: true
		},
		price: Number,
		stock: Number,
		category: String,
		status: {
			type: Boolean,
			default: true
		}
	},
	{
		strict: false
	}
)

export const productModel = mongoose.model('products', productSchema)