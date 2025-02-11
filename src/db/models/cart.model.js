import mongooseLeanVirtuals from 'mongoose-lean-virtuals';
import { model, Schema } from 'mongoose';

const cartSchema = new Schema(
	{
		products: [
			{
				product: {
					type: Schema.Types.ObjectId,
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

cartSchema.plugin(mongooseLeanVirtuals);

cartSchema.pre('find', function () {
	this.populate('products.product');
});
cartSchema.pre('findOne', function () {
	this.populate('products.product');
});

cartSchema.pre('findOneAndUpdate', function () {
	this.populate('products.product');
});

export const cartModel = model('carts', cartSchema);
