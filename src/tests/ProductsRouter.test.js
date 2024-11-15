import { describe, expect, expectTypeOf, it } from "vitest";
import { ProductValidator } from "../utils/Product-Validator.js";
import { ProductsManager } from "../dao/Mongo/Product-Manager-Mongo.js";
let usedCode;
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
let product = await response.json()
let usedId = product._id


export function randomCode() {
	return String(Math.round(Math.random() * 9999999));
}


describe('POST /products valid', async () => {
	usedCode = randomCode()
	const validProduct = {
		title: "s",
		description: "d",
		price: 2,
		thumbnail: "",
		status: true,
		code: usedCode,
		stock: 25,
		category: "d",
	}
	let endpoint = 'http://localhost:8080/api/products';
	let response = await fetch(endpoint, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(validProduct)
	})

	const data = await response.json();
	const { addedProduct } = data;
	usedId = addedProduct._id


	it('Should have status 201', () => {
		expect(response.status).toBe(201)
	})
	it('Product should have id', () => {
		expect(Object.hasOwn(addedProduct, 'id'))
	})
	let response2 = await fetch(`${endpoint}/?limit=999999`)
	let { payload: products } = await response2.json()
	it('Id should be unique', () => {
		expect(products.filter(p => p._id == addedProduct._id).length).toBe(1)
	})
})
describe('POST /products with empty camp', async () => {
	const emptyCampProduct = {
		title: "",
		description: 'producto sin titulo',
		price: 0,
		thumbnail: "",
		status: true,
		code: randomCode(),
		stock: 25,
		category: "d",
		asdad: "",
		id: 6
	}
	const endpoint = 'http://localhost:8080/api/products';
	const response = await fetch(endpoint, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(emptyCampProduct)
	})
	const data = await response.json();
	it('Should have status 400', () => {
		expect(response.status).toBe(400);
	})
	it('Error message should be empty camp', () => {
		expect(data.detail).toBe(ProductValidator.errorMessages.emptyCamp)
	})
})

describe('POST /products with missing camp', async () => {
	const missingCampProduct = {
		description: 'hola',
		price: 0,
		thumbnail: "",
		status: true,
		code: "asddsa",
		stock: 25,
		category: "d",
		asdad: "",
		id: 6
	}
	const endpoint = 'http://localhost:8080/api/products';
	const response = await fetch(endpoint, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(missingCampProduct)
	})
	const data = await response.json();

	it('Should have status 400', () => {
		expect(response.status).toBe(400)
	})
	it('Error message should be missing camp', () => {
		expect(data.detail).toBe(ProductValidator.errorMessages.missingCamp)
	})
})

describe('POST /products with duplicated code', async () => {
	const duplicatedCodeProduct = {
		title: 's',
		description: 'hola',
		price: 0,
		thumbnail: "",
		status: true,
		code: usedCode,
		stock: 25,
		category: "d",
		asdad: "",
		id: 6
	}
	const endpoint = 'http://localhost:8080/api/products';
	const response = await fetch(endpoint, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(duplicatedCodeProduct)
	})
	const data = await response.json();

	it('Should have status 400', () => {
		expect(response.status).toBe(400)
	})
	it('Error message should be duplicated code', () => {
		expect(data.detail).toBe(ProductValidator.errorMessages.duplicatedCode)
	})
})

describe('GET /products', async () => {
	const endpoint = 'http://localhost:8080/api/products';
	const response = await fetch(endpoint)
	const data = await response.json()
	it('Should have status 200', () => {
		expect(response.status).toBe(200)
	});
	it('Data should be an array', () => {
		expectTypeOf(data).toBeArray
	})
})

describe('GET /products/:pid valid', async () => {
	const endpoint = `http://localhost:8080/api/products/${usedId}`;
	const response = await fetch(endpoint)
	const product = await response.json();
	it('Should have status 200', () => {
		expect(response.status).toBe(200)
	})

	it('Product id is id requested', () => {

		expect(product._id).toBe(usedId)
	})
})

describe('GET /products/:pid not found id', async () => {
	const endpoint = `http://localhost:8080/api/products/000000000000000000000000`;
	const response = await fetch(endpoint)
	const data = await response.json()
	it('Should have status 404', () => {
		expect(response.status).toBe(404)
	})
	it('Error message should be product not found', () => {
		expect(data.detail).toBe(ProductsManager.errorMessages.productNotFound)
	})
})


describe('PUT /products/:pid valid', async () => {

	const validProduct = {
		title: "a",
		description: "b",
		price: 0,
		thumbnail: "",
		status: true,
		code: randomCode(),
		stock: 30,
		category: "c",
		id: -1
	}
	const endpoint = `http://localhost:8080/api/products/${usedId}`;
	const response = await fetch(endpoint, {
		method: 'PUT',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(validProduct)
	})

	const { updatedProduct } = await response.json()
	const { _id } = updatedProduct


	it('Should have status 200', () => {
		expect(response.status).toBe(200)
	})
	it('Id should have not changed', () => {
		expect(_id).toBe(usedId)
	})
	delete validProduct._id
	delete updatedProduct._id

	it('Should update values', () => {
		expect(updatedProduct).include(validProduct)
	})
})

describe('PUT /products/:pid invalid id', async () => {
	const invalidIdProduct = {
		title: "a",
		description: "b",
		price: 0,
		thumbnail: "",
		status: true,
		code: randomCode(),
		stock: 30,
		category: "c",
		id: -1
	}
	const endpoint = `http://localhost:8080/api/products/673261c2a615becb487f1fe2`;
	const response = await fetch(endpoint, {
		method: 'PUT',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(invalidIdProduct)
	})
	const data = await response.json()
	it('Should have status 404', () => {
		expect(response.status).toBe(404)
	})
	it('Error message should be product not found', () => {
		expect(data.detail).toBe(ProductsManager.errorMessages.productNotFound)
	})
})

describe('PUT /products/:pid invalid values', async () => {
	const invalidIdProduct = {
		title: "",
		description: "b",
		price: 0,
		thumbnail: "",
		status: true,
		code: 912,
		stock: 30,
		category: "c",
		id: -1
	}
	const endpoint = `http://localhost:8080/api/products/${usedId}`;
	const response = await fetch(endpoint, {
		method: 'PUT',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(invalidIdProduct)
	})
	const data = await response.json()

	it('Should have status 400', () => {
		expect(response.status).toBe(400)
	})
	it('Error message should be empty camp', () => {
		expect(data.detail).toBe(ProductValidator.errorMessages.emptyCamp)
	})
})

describe('DELETE /products/:pid valid', async () => {
	const endpoint = `http://localhost:8080/api/products/${usedId}`;
	let response = await fetch(endpoint, { method: 'DELETE' })

	it('Should have status 200', () => {
		expect(response.status).toBe(200)
	})

	let response2 = await fetch(endpoint)
	it('Product is not aviable after delete', () => {
		expect(response2.status).toBe(404)
	})
})

describe('DELETE /products/:pid invalid id', async () => {
	const endpoint = 'http://localhost:8080/api/products/673134ab2628f9f38050b816';
	let response = await fetch(endpoint, { method: 'DELETE' })
	const data = await response.json()

	it('Should have status 404', () => {
		expect(response.status).toBe(404)
	})
	it('Error message should be product not found', () => {
		expect(data.detail).toBe(ProductsManager.errorMessages.productNotFound)
	})
})