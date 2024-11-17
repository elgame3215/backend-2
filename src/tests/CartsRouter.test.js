import { describe, it, expect, expectTypeOf, assert } from "vitest";
import { CartsManager } from "../dao/Mongo/Cart-Manager-Mongo.js";
import { ProductsManager } from "../dao/Mongo/Product-Manager-Mongo.js";
import { randomCode } from "./ProductsRouter.test.js";
let usedCid;
let validProduct = {
	title: "s",
	description: "d",
	price: 2,
	thumbnail: "",
	status: true,
	code: randomCode(),
	stock: 25,
	category: "d",
}
let response = await fetch('http://localhost:8080/api/products', {
	method: 'POST',
	headers: {
		'Content-Type': 'application/json'
	},
	body: JSON.stringify(validProduct)
})
let data = await response.json()
let usedPid = data.addedProduct._id




describe('POST /carts valid', async () => {
	const endpoint = 'http://localhost:8080/api/carts';
	const response = await fetch(endpoint, { method: 'POST' })
	const data = await response.json()
	usedCid = data.addedCart._id;

	it('Should have status 201', () => {
		expect(response.status).toBe(201)
	})
})


describe('GET /carts/:cid valid', async () => {
	const endpoint = `http://localhost:8080/api/carts/${usedCid}`;
	const response = await fetch(endpoint)
	const data = await response.json()

	it('Should have status 200', () => {
		expect(response.status).toBe(200)
	})
	it('Data is an array', () => {
		expectTypeOf(data).toBeArray
	})
})
//
describe('GET /carts/:cid invalid id', async () => {
	const endpoint = 'http://localhost:8080/api/carts/6732d40735244dfefccf24a2';
	const response = await fetch(endpoint)
	const data = await response.json()

	it('Should have status 404', () => {
		expect(response.status).toBe(404)
	})
	it('Error message should be cart not found', () => {
		expect(data.detail).toBe(CartsManager.errorMessages.cartNotFound)
	})
})

describe('POST /:cid/product/:pid valid', async () => {
	const endpoint = `http://localhost:8080/api/carts/${usedCid}/product/${usedPid}`;
	const response = await fetch(endpoint, { method: 'POST' })
	const data = await response.json()
	const usedpid = usedPid
	it('Should have status 200', () => {
		expect(response.status).toBe(200)
	})
	it('Cart products should contain product id', () => {
		assert.isTrue((data.updatedCart.products).some(p => p.product == usedpid))
	})
})

describe('POST /:cid/product/:pid no stock', async () => {
	usedPid = (await (await fetch('http://localhost:8080/api/products', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({
			...validProduct,
			stock: 0,
			code: randomCode()
		})
	})).json()).addedProduct._id

	const endpoint = `http://localhost:8080/api/carts/${usedCid}/product/${usedPid}`;
	const response = await fetch(endpoint, { method: 'POST' })
	const data = await response.json()

	it('Should have status 400', () => {
		expect(response.status).toBe(400)
	})
	it('Error message should be product out of stock', () => {
		expect(data.detail).toBe(ProductsManager.errorMessages.productOutOfStock)
	})
})

describe('POST /:cid/product/:pid invalid cid', async () => {
	const validProduct = {
		title: "s",
		description: "d",
		price: 0,
		thumbnail: "",
		status: true,
		code: randomCode(),
		stock: 25,
		category: "d",
	}
	const response1 = await fetch('http://localhost:8080/api/products', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(validProduct)
	})
	const { addedProduct } = await response1.json()

	const endpoint = `http://localhost:8080/api/carts/6732d40735244dfefccf24a5/product/${addedProduct._id}`;
	const response = await fetch(endpoint, { method: 'POST' })
	const data = await response.json()

	it('Should have status 404', () => {
		expect(response.status).toBe(404)
	})
	it('Error message should be cart not found', () => {
		expect(data.detail).toBe(CartsManager.errorMessages.cartNotFound)
	})
})

describe('POST /:cid/product/:pid invalid pid', async () => {
	const endpoint = `http://localhost:8080/api/carts/${usedCid}/product/000000000000000000000000`;
	const response = await fetch(endpoint, { method: 'POST' })
	const data = await response.json()

	it('Should have status 404', () => {
		expect(response.status).toBe(404)
	})
	it('Error message should be product not found', () => {
		expect(data.detail).toBe(ProductsManager.errorMessages.productNotFound)
	})
})

describe('PUT /:cid/product/:pid no stock', async () => {
	usedPid = (await (await fetch('http://localhost:8080/api/products', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({
			...validProduct,
			stock: 10,
			code: randomCode()
		})
	})).json()).addedProduct._id

	await fetch(`http://localhost:8080/api/carts/${usedCid}/product/${usedPid}`, {method: 'POST'})

	const endpoint = `http://localhost:8080/api/carts/${usedCid}/product/${usedPid}`;
	const response = await fetch(endpoint, {
		method: 'PUT',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({
			quantity: 25
		})
	})
	const data = await response.json()
	
	it('Should have status 400', () => {
		expect(response.status).toBe(400)
	})
	it('Error message should be product out of stock', () => {
		expect(data.detail).toBe(ProductsManager.errorMessages.productOutOfStock)
	})
})

describe('PUT /:cid valid', async () => {
	const endpoint = `http://localhost:8080/api/carts/${usedCid}`;
	const products = JSON.stringify([{
		quantity: 10,
		product: usedPid
	}]);
	const response = await fetch(endpoint, {
		method: 'PUT',
		headers: { 'Content-Type': 'application/json' },
		body: products
	})
	const data = await response.json()
	it('Should have status 200', () => {
		expect(response.status).toBe(200)
	})
	it('Products have been updated', () => {
		expect(data.updatedCart.products.map(p => {
			const { quantity, product } = p
			return { quantity, product }
		})).toEqual(JSON.parse(products))
	})
})

describe('PUT /:cid/products/:pid', async () => {
	const endpoint = `http://localhost:8080/api/carts/${usedCid}/product/${usedPid}`;
	const quantity = 10
	const products = JSON.stringify({ quantity });
	const response = await fetch(endpoint, {
		method: 'PUT',
		headers: { 'Content-Type': 'application/json' },
		body: products
	})
	const data = await response.json()

	it('Should have status 200', () => {
		expect(response.status).toBe(200)
	})
	it('Quantity should be updated', () => {
		expect(data.updatedCart.products.find(p => p.product == usedPid).quantity).toBe(quantity)
	})
})

describe('DELETE /:cid/product/:pid valid', async () => {
	const endpoint = `http://localhost:8080/api/carts/${usedCid}/product/${usedPid}`;
	const response = await fetch(endpoint, { method: 'DELETE' })
	const data = await response.json()
	
	it('Should have status 200', () => {
		expect(response.status).toBe(200)
	})
	it('Product id has been deleted', () => {
		expect(data.updatedCart.products.find(p => p._id == usedPid)).toBeFalsy()
	})
})


describe('DELETE api/carts/:cid', async () => {
	const endpoint = `http://localhost:8080/api/carts/${usedCid}`;
	const response = await fetch(endpoint, { method: 'DELETE' })
	const data = await response.json()

	it('Should have status 200', () => {
		expect(response.status).toBe(200)
	})
	it('Cart must be empty', () => {
		expect(data.updatedCart.products.length).toBe(0)
	})

})