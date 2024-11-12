import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
	products: [{
		product: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'products'
		},
		quantity: Number
	}]
})

cartSchema.pre('find', function() {
	console.log(this);
	this.populate('products.product').lean()
})
cartSchema.pre('findOne', function() {
	this.populate('products.product').lean()
})



export const cartModel = mongoose.model('carts', cartSchema)