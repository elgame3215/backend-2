import mongoose from "mongoose";

const cartSchema = new mongoose.Schema(
	{
		products: [{
			product: {
				type: mongoose.Schema.Types.ObjectId,
				ref: 'products'
			},
			quantity: Number
		}]
	},
	{
		collection: 'carts'
	}
);

cartSchema.pre('find', function () {
	this.populate('products.product');
});
cartSchema.pre('findOne', function () {
	this.populate('products.product');
});



export const cartModel = mongoose.model('carts', cartSchema);

