import mongoose from 'mongoose';
import mongooseLeanVirtuals from 'mongoose-lean-virtuals';
import paginate from 'mongoose-paginate-v2';

const productSchema = new mongoose.Schema(
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
		collection: 'products',
		id: true,
		toJSON: { virtuals: true },
		toObject: { virtuals: true },
	}
);

productSchema.plugin(paginate);
productSchema.plugin(mongooseLeanVirtuals);

export const productModel = mongoose.model('products', productSchema);
