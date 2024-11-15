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

	it('Should have status 200', () => {
		expect(response.status).toBe(200)
	})
	it('Cart products should contain product id', () => {
		assert.isTrue((data.updatedCart.products).some(p => p._id == usedPid))
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