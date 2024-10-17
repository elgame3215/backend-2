import { describe, expect, it } from "vitest";
import { ProductValidator } from "../utils/Product-Validator";
import { ProductsManager } from "../managers/Product-Manager";
let usedCode;
let usedId;

describe('POST /products valid', async () => {
	usedCode = Math.round(Math.random() * 9999)
	const validProduct = {
		title: "s",
		description: "d",
		price: 0,
		thumbnail: "",
		status: true,
		code: usedCode,
		stock: 25,
		category: "d",
	}
	const endpoint = 'http://localhost:8080/api/products';
	const response = await fetch(endpoint, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(validProduct)
	})
	const { addedProduct } = (await response.json());
	usedId = addedProduct.id
	it('Should have status 201', () => {
		expect(response.status).toBe(201)
	})
	it('Should return a JSON', () => {
		expect(response.headers.get('Content-Type')).toContain('application/json')
	})
	it('Product should have id', () => {
		expect(Object.hasOwn(addedProduct, 'id'))
	})
})
describe('POST /products with empty camp', async () => {
	const emptyCampProduct = {
		title: "",
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
	it('Should have status 200', () => {
		expect(response.status).toBe(200)
	});
	it('Should return a JSON', () => {
		expect(response.headers.get('Content-Type')).toContain('application/json')
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
		expect(product.id).toBe(usedId)
	})
})

describe('GET /products/:pid not found id', async () => {
	const endpoint = `http://localhost:8080/api/products/-1`;
	const response = await fetch(endpoint)
	const data = await response.json()
	it('Should have status 404', () => {
		expect(response.status).toBe(404)
	})
	it('Error message should be product not found', () => {
		expect(data.error).toBe(ProductsManager.errorMessages.productNotFound)
	})
})

// describe('PUT /products:pid valid', () => {
	
// })