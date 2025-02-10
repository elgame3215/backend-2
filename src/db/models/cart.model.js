import mongoose from 'mongoose';
import mongooseLeanVirtuals from 'mongoose-lean-virtuals';

const cartSchema = new mongoose.Schema(
	{
		products: [
			{
				product: {
					type: mongoose.Schema.Types.ObjectId,
					ref: 'products',
				},
				quantity: Number,
			},
		],
	},
	{
		collection: 'carts',
		id: true,
		toJSON: { virtuals: true },
		toObject: { virtuals: true },
	}
);

cartSchema.pre('find', function () {
	this.populate('products.product').lean();
});
cartSchema.pre('findOne', function () {
	this.populate('products.product').lean();
});

cartSchema.pre('findOneAndUpdate', function () {
	this.populate('products.product').lean();
});

cartSchema.plugin(mongooseLeanVirtuals);

export const cartModel = mongoose.model('carts', cartSchema);
