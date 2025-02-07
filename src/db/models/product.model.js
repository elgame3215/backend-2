import mongoose from 'mongoose';
import paginate from 'mongoose-paginate-v2';

const productReqSchema = new mongoose.Schema(
	{
		title: String,
		description: String,
		code: {
			type: String,
			unique: true,
		},
		price: Number,
		stock: Number,
		category: String,
		status: {
			type: Boolean,
			default: true,
		},
	},
	{
		strict: false,
		collection: 'products',
	}
);

productReqSchema.plugin(paginate);

export const productModel = mongoose.model('products', productReqSchema);
